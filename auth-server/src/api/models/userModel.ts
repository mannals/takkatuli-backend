import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {
  UserWithLevel,
  User,
  UserWithNoPassword,
  UserWithProfilePicture,
  UpdateUser,
} from '@sharedTypes/DBTypes';
import {UserDeleteResponse} from '@sharedTypes/MessageTypes';

const getUserById = async (id: number): Promise<UserWithNoPassword | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithNoPassword[]
    >(
      `
      SELECT
        Users.user_id,
        Users.username,
        Users.email,
        Users.bio_text,
        Users.created_at,
        UserLevels.level_name
      FROM Users
      JOIN UserLevels
      ON Users.user_level_id = UserLevels.level_id
      WHERE Users.user_id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (e) {
    console.error('getUserById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserWithProfilePicture = async (
  id: number,
): Promise<UserWithProfilePicture | null> => {
  try {
    const uploadPath = process.env.UPLOAD_URL;
    console.log(uploadPath);
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithProfilePicture[]
    >(
      `
      SELECT
        Users.user_id,
        Users.username,
        Users.email,
        Users.bio_text,
        Users.created_at,
        UserLevels.level_name,
        ProfilePictures.filename,
        ProfilePictures.filesize,
        ProfilePictures.media_type
      FROM Users
      JOIN UserLevels
      ON Users.user_level_id = UserLevels.level_id
      LEFT JOIN ProfilePictures
      ON Users.user_id = ProfilePictures.user_id
      WHERE Users.user_id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }
    if (rows[0].filename) {
      rows[0].filename = uploadPath + rows[0].filename;
    }

    console.log(rows[0]);

    return rows[0];
  } catch (e) {
    console.error('getUserWithProfilePicture error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getAllUsers = async (): Promise<UserWithNoPassword[] | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithNoPassword[]
    >(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.email,
      Users.created_at,
      UserLevels.level_name
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
  `,
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getAllUsers error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserByEmail = async (email: string): Promise<UserWithLevel | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.password,
      Users.email,
      Users.created_at,
      UserLevels.level_name
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
    WHERE Users.email = ?
  `,
      [email],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserByEmail error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserByUsername = async (
  username: string,
): Promise<UserWithLevel | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.password,
      Users.email,
      Users.created_at,
      UserLevels.level_name
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
    WHERE Users.username = ?
  `,
      [username],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserByUsername error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserPassword = async (user_id: string): Promise<string | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & User[]>(
      `
    SELECT
      password
    FROM Users
    WHERE user_id = ?
  `,
      [user_id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].password;
  } catch (e) {
    console.error('getUserPassword error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const changeUserPassword = async (
  user_id: string,
  password: string,
): Promise<boolean> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      `
    UPDATE Users
    SET password = ?
    WHERE user_id = ?
  `,
      [password, user_id],
    );
    return result.affectedRows === 1;
  } catch (e) {
    console.error('changeUserPassword error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const createUser = async (
  user: Pick<User, 'username' | 'password' | 'email'>,
): Promise<UserWithProfilePicture | null> => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(
      `
    INSERT INTO Users (username, password, email)
    VALUES (?, ?, ?)
  `,
      [user.username, user.password, user.email],
    );

    if (result[0].affectedRows === 0) {
      return null;
    }

    const newUser = await getUserWithProfilePicture(result[0].insertId);
    return newUser;
  } catch (e) {
    console.error('createUser error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const modifyUser = async (
  user: UpdateUser,
  id: number,
): Promise<UserWithProfilePicture | null> => {
  try {
    console.log('modifyUser entered');
    console.log(user);
    const sql = promisePool.format(
      `
      UPDATE Users
      SET edited_at = CURRENT_TIMESTAMP, ?
      WHERE user_id = ?
      ;`,
      [user, id],
    );

    const result = await promisePool.execute<ResultSetHeader>(sql);

    if (result[0].affectedRows === 0) {
      return null;
    }

    const newUser = await getUserWithProfilePicture(id);
    return newUser;
  } catch (e) {
    console.error('modifyUser error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const deleteUser = async (id: number): Promise<UserDeleteResponse | null> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM PostVotes WHERE user_id = ?;', [id]);

    await connection.execute(
      'CREATE TEMPORARY TABLE temp_table SELECT post_id FROM Posts WHERE user_id = ?;',
      [id],
    );
    await connection.execute(
      'CREATE TEMPORARY TABLE temp_table_replies SELECT post_id FROM Posts WHERE reply_to IN (SELECT post_id FROM temp_table);',
    );

    await connection.execute(
      'DELETE FROM PostVotes WHERE post_id IN (SELECT post_id FROM temp_table UNION SELECT post_id FROM temp_table_replies);',
    );
    await connection.execute(
      'DELETE FROM Posts WHERE reply_to IN (SELECT post_id FROM temp_table);',
      [id],
    );
    await connection.execute(
      'DELETE FROM Posts WHERE post_id IN (SELECT post_id FROM temp_table);',
    );
    await connection.execute('DELETE FROM ProfilePictures WHERE user_id = ?;', [
      id,
    ]);

    await connection.execute('DROP TEMPORARY TABLE temp_table;');
    await connection.execute('DROP TEMPORARY TABLE temp_table_replies;');
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?;',
      [id],
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return null;
    }

    console.log('result', result);
    return {message: 'User deleted', user: {user_id: id}};
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
};

export {
  getUserById,
  getUserWithProfilePicture,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  getUserPassword,
  changeUserPassword,
  createUser,
  modifyUser,
  deleteUser,
};
