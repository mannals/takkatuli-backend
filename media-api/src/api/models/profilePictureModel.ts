import {FileData, ProfilePicture} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

const fetchProfilePicture = async (
  user_id: number
): Promise<ProfilePicture | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & ProfilePicture[]
    >('SELECT * FROM ProfilePictures WHERE user_id = ?', [user_id]);
    if (!rows) {
      return null;
    }
    return rows[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const fetchProfilePictureWithImage = async (
  user_id: number
): Promise<ProfilePicture | null> => {
  try {
    console.log('fetchProfilePictureWithImage');
    const uploadPath = process.env.UPLOAD_URL;
    const [rows] = await promisePool.execute<
      RowDataPacket[] & ProfilePicture[]
    >(
      'SELECT *, CONCAT(?, filename) AS filename FROM ProfilePictures WHERE user_id = ?',
      [uploadPath, user_id]
    );
    if (rows.length === 0) {
      console.log('couldnt find prof pic');
      return null;
    }
    return rows[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const changeProfilePicture = async (
  fileData: FileData,
  user_id: number
): Promise<ProfilePicture> => {
  const {filename, filesize, media_type} = fileData;
  console.log('changeProfilePicture', fileData, user_id);

  // checking if user already has a profile picture
  const currentProfilePicture = await fetchProfilePicture(user_id);
  console.log('object', currentProfilePicture);
  const uploadPath = process.env.UPLOAD_URL;

  if (!currentProfilePicture || currentProfilePicture === null) {
    try {
      const result = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO ProfilePictures (user_id, filename, filesize, media_type) VALUES (?, ?, ?, ?)',
        [user_id, filename, filesize, media_type]
      );
      console.log('currently no profile picture', result);
      const [rows] = await promisePool.execute<
        RowDataPacket[] & ProfilePicture[]
      >(
        'SELECT *, CONCAT(?, filename) AS filename, CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail FROM ProfilePictures WHERE user_id = ?',
        [uploadPath, uploadPath, user_id]
      );
      console.log('rows', rows);
      if (rows.length === 0) {
        throw new Error('Profile picture not found');
      }
      return rows[0];
    } catch (e) {
      throw new Error((e as Error).message);
    }
  } else {
    try {
      const result = await promisePool.execute<ResultSetHeader>(
        'UPDATE ProfilePictures SET filename = ?, filesize = ?, media_type = ? WHERE user_id = ?',
        [filename, filesize, media_type, user_id]
      );
      console.log(result);
      const [rows] = await promisePool.execute<
        RowDataPacket[] & ProfilePicture[]
      >(
        'SELECT *, CONCAT(?, filename) AS filename, CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail FROM ProfilePictures WHERE user_id = ?',
        [uploadPath, uploadPath, user_id]
      );
      console.log('rows', rows);
      if (rows.length === 0) {
        throw new Error('Profile picture not found');
      }
      return rows[0];
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }
};

export {
  fetchProfilePicture,
  fetchProfilePictureWithImage,
  changeProfilePicture,
};
