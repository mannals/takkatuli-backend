import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Post, TokenContent} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

/**
 * Get all posts from the database
 * whether they are original posts or replies
 *
 * @returns {array} - array of media items
 * @throws {Error} - error if database query fails
 */

const fetchAllPosts = async (): Promise<Post[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Posts`,
      [uploadPath, uploadPath]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllPosts error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all posts from database
 * that are not replies to other posts
 *
 * @returns {array} - array of media items
 * @throws {Error} - error if database query fails
 */
const fetchAllOriginalPosts = async (): Promise<Post[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Posts
      WHERE reply_to IS NULL`,
      [uploadPath, uploadPath]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllOriginalPosts error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get post by id from the database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing all information about the media item
 * @throws {Error} - error if database query fails
 */

const fetchPostById = async (id: number): Promise<Post | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
    const sql = `SELECT post_id, user_id, category_id, title, text_content,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Posts
                WHERE post_id=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      sql,
      params
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchPostById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get replies to post with post id from database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing all information about the media item
 * @throws {Error} - error if database query fails
 */
const fetchRepliesById = async (id: number): Promise<Post | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Posts
                WHERE reply_to=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      sql,
      params
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchRepliesById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Add new media item to database
 *
 * @param {object} media - object containing all information about the new media item
 * @returns {object} - object containing id of the inserted media item in db
 * @throws {Error} - error if database query fails
 */
const postMedia = async (
  media: Omit<Post, 'post_id' | 'created_at'>
): Promise<Post | null> => {
  const {
    user_id,
    filename,
    filesize,
    media_type,
    is_poll,
    reply_to,
    title,
    text_content,
  } = media;
  const sql = `INSERT INTO Posts (user_id, filename, filesize, media_type, is_poll, reply_to, title, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    user_id,
    filename,
    filesize,
    media_type,
    is_poll,
    reply_to,
    title,
    text_content,
  ];
  try {
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    console.log('result', result);
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      'SELECT * FROM Posts WHERE post_id = ?',
      [result[0].insertId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Update media item in database
 *
 * @param {object} media - object containing all information about the media item
 * @param {number} id - id of the media item
 * @returns {object} - object containing id of the updated media item in db
 * @throws {Error} - error if database query fails
 */

const putMedia = async (
  media: Pick<Post, 'title' | 'text_content'>,
  id: number
) => {
  try {
    const sql = promisePool.format('UPDATE Posts SET ? WHERE ?', [media, id]);
    const result = await promisePool.execute<ResultSetHeader>(sql);
    console.log('result', result);
    return {media_id: result[0].insertId};
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete media item from database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing id of the deleted media item in db
 * @throws {Error} - error if database query fails
 */

const deletePost = async (
  id: number,
  user: TokenContent,
  token: string
): Promise<MessageResponse> => {
  console.log('deletePost', id);
  const media = await fetchPostById(id);
  console.log(media);

  if (!media) {
    return {message: 'Post not found'};
  }

  // if admin add user_id from media object to user object from token content
  if (user.level_name === 'Admin') {
    user.user_id = media.user_id;
  }

  // remove environment variable UPLOAD_URL from filename
  if (media.filename) {
    media.filename = media?.filename.replace(
      process.env.UPLOAD_URL as string,
      ''
    );
  }

  console.log(token);

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM PostVotes WHERE post_id = ?;', [id]);

    await connection.execute(
      'DELETE FROM PollOptionVotes WHERE option_id = (SELECT option_id FROM PollOptions WHERE post_id = ?);',
      [id]
    );

    await connection.execute('DELETE FROM PollOptions WHERE post_id = ?;', [
      id,
    ]);

    await connection.execute('DELETE FROM Posts WHERE reply_to = ?;', [id]);

    // ! user_id in SQL so that only the owner of the media item can delete it
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Posts WHERE post_id = ? and user_id = ?;',
      [id, user.user_id]
    );

    if (result.affectedRows === 0) {
      return {message: 'Post not deleted'};
    }

    // delete file from upload server
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    const deleteResult = await fetchData<MessageResponse>(
      `${process.env.UPLOAD_SERVER}/delete/${media.filename}`,
      options
    );

    console.log('deleteResult', deleteResult);
    if (deleteResult.message !== 'File deleted') {
      throw new Error('File not deleted');
    }

    // if no errors commit transaction
    await connection.commit();

    return {message: 'Post deleted'};
  } catch (e) {
    await connection.rollback();
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

/**
 * Get all the most liked media items from the database
 *
 * @returns {object} - object containing all information about the most liked media item
 * @throws {Error} - error if database query fails
 */

const fetchMostLikedPosts = async (): Promise<Post | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      'SELECT * FROM `MostLikedPosts`'
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.MEDIA_SERVER + '/uploads/' + rows[0].filename;
  } catch (e) {
    console.error('getMostLikedPosts error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all the most commented media items from the database
 *
 * @returns {object} - object containing all information about the most commented media item
 * @throws {Error} - error if database query fails
 */

const fetchMostCommentedMedia = async (): Promise<Post | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      'SELECT * FROM `MostCommentedPosts`'
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.MEDIA_SERVER + '/uploads/' + rows[0].filename;
  } catch (e) {
    console.error('getMostCommentedPosts error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllPosts,
  fetchAllOriginalPosts,
  fetchPostById,
  fetchRepliesById,
  postMedia,
  deletePost,
  fetchMostLikedPosts,
  fetchMostCommentedMedia,
  putMedia,
};
