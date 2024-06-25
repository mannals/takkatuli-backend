/* eslint-disable node/no-unpublished-import */
import {
  EditPostWithFile,
  EditedPost,
  PostVote,
  ProfilePicture,
  Votes,
} from './../../../../shared-types/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {
  NewPostWithFile,
  NewPostWithoutFile,
  Post,
  PostIDandTitle,
  PostInSubcatListing,
  PostPreview,
  PostWithAll,
  RepliesAmount,
  Subcategory,
  TokenContent,
  User,
} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {fetchNewestPostFromSubcategory} from './categoryModel';

/**
 * Get all posts from the database with all information.
 * This function fetches all posts, including replies to other posts.
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
 * Get all posts from database that are not replies to other posts
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
 * Get all original posts as a preview for subcategory listing 
 * with the subcategory ID.
 * This function fetches the relevant data for a PostPreview type.
 *
 * @param {number} subcat_id - ID of subcategory
 * @returns {array} - array of posts
 * @throws {Error} - error if database query fails
 */
const fetchPostsBySubcat = async (subcat_id: number) => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] &
        Pick<Post, 'post_id' | 'created_at' | 'user_id' | 'title'>
    >(
      `SELECT post_id, created_at, user_id, title
      FROM Posts
      WHERE subcategory_id = ? AND reply_to IS NULL
      ORDER BY created_at DESC`,
      [subcat_id]
    );
    if (rows.length === 0) {
      console.log('posts not found');
      return null;
    }

    console.log(rows[0]);
    console.log(rows[0].user_id);
    const postPreviews: PostPreview[] = [];

    for (const row of rows) {
      console.log('row loop entered, row.user_id:', row.user_id);
      const [owner] = await promisePool.execute<
        RowDataPacket[] & Pick<User, 'username'>
      >('SELECT username FROM Users WHERE user_id = ?', [row.user_id]);
      if (owner.length === 0) {
        console.log('owner not found');
        return null;
      }
      console.log('owner', owner[0]);

      console.log('row post id', row.post_id);

      try {
        const [latest] = await promisePool.execute<
          RowDataPacket[] & Pick<Post, 'created_at' | 'user_id'>
        >(
          `SELECT created_at, user_id FROM Posts
        WHERE reply_to = ? 
        ORDER BY created_at LIMIT 1`,
          [row.post_id]
        );

        console.log('latest reply data', latest[0]);

        const [latestUser] = await promisePool.execute<
          RowDataPacket[] & Pick<User, 'username'>
        >('SELECT username FROM Users WHERE user_id = ?', [latest[0].user_id]);

        if (latestUser.length === 0) {
          console.log('latest user not found');
          return null;
        }

        const latestData = {
          created_at: latest[0].created_at,
          username: latestUser[0].username,
        };

        const repliesAmount = await promisePool.execute<
          RowDataPacket[] & RepliesAmount[]
        >('SELECT COUNT(*) AS replies FROM Posts WHERE reply_to = ?', [
          row.post_id,
        ]);
        const replies = repliesAmount[0][0].replies;
        console.log(replies);

        const postPreview: PostPreview = {
          post_id: row.post_id,
          title: row.title,
          created_at: row.created_at,
          username: owner[0].username,
          latest: {...latestData},
          replies_count: replies,
        };

        postPreviews.push(postPreview);
      } catch (e) {
        const latestData = {
          created_at: row.created_at,
          username: owner[0].username,
        };

        const postPreview: PostPreview = {
          post_id: row.post_id,
          title: row.title,
          created_at: row.created_at,
          username: owner[0].username,
          latest: latestData,
          replies_count: 0,
        };

        console.log('pushing');
        postPreviews.push(postPreview);
      }
    }
    return postPreviews;
  } catch (e) {
    console.error('fetchPostsBySubcat error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get post by id from the database
 *
 * @param {number} id - id of the media item
 * @returns {object} - PostWithAll object containing all information about the media item,
 * including owner's username, subcategory name, profile picture, and votes
 * @throws {Error} - error if database query fails
 */

const fetchPostById = async (id: number): Promise<PostWithAll | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Posts
                WHERE post_id=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      sql,
      params
    );
    console.log(rows);
    if (rows.length === 0) {
      console.log('post data error');
      return null;
    }

    const userId = rows[0].user_id;

    const sql2 =
      'SELECT *, CONCAT(?, filename) AS filename FROM ProfilePictures WHERE user_id = ?';
    const [profPic] = await promisePool.execute<
      RowDataPacket[] &
        Pick<ProfilePicture, 'filename' | 'filesize' | 'media_type'>[]
    >(sql2, [uploadPath, userId]);

    if (profPic.length === 0) {
      console.log('no profile picture found');
    }

    const votes = await fetchLikesDislikesByPostId(id);

    const sql3 = 'SELECT username FROM Users WHERE user_id = ?';
    const [owner] = await promisePool.execute<
      RowDataPacket[] & Pick<User, 'username'>[]
    >(sql3, [userId]);

    console.log(owner);
    if (owner.length === 0) {
      console.log('owner error');
      return null;
    }

    const subcatId = rows[0].subcategory_id;
    const sql4 = 'SELECT title FROM Subcategories WHERE subcategory_id = ?';
    const [subcatName] = await promisePool.execute<
      RowDataPacket[] & Pick<Subcategory, 'title'>[]
    >(sql4, [subcatId]);
    if (subcatName.length === 0) {
      console.log('subcat title error');
      return null;
    }

    console.log(owner[0]);
    console.log(subcatName[0]);
    if (profPic.length !== 0) {
      const postInfo: PostWithAll = {
        ...rows[0],
        profile_picture: {
          filename: profPic[0].filename,
          filesize: profPic[0].filesize,
          media_type: profPic[0].media_type,
        },
        votes: {
          likes: votes.likes,
          dislikes: votes.dislikes,
        },
        username: owner[0].username,
        subcategory_name: subcatName[0].title,
      };
      return postInfo;
    } else {
      const postInfo: PostWithAll = {
        ...rows[0],
        votes: {
          likes: votes.likes,
          dislikes: votes.dislikes,
        },
        username: owner[0].username,
        subcategory_name: subcatName[0].title,
      };
      return postInfo;
    }
  } catch (e) {
    console.error('fetchPostById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all likes and dislikes for a post.
 * This function fetches the relevant data for a Votes type, which contains
 * arrays of PostVote objects for likes and dislikes.
 *
 * @param {number} postId - id of the post
 * @returns {object} - object containing all likes and dislikes for the post.
 * @throws {Error} - error if database query fails
 */
const fetchLikesDislikesByPostId = async (postId: number): Promise<Votes> => {
  try {
    console.log('fetching votes');
    const votes: Votes = {
      likes: [],
      dislikes: [],
    };
    const [likes] = await promisePool.execute<RowDataPacket[] & PostVote[]>(
      'SELECT * FROM PostVotes WHERE post_id = ? AND approve = 1',
      [postId]
    );
    console.log('likes', likes);
    if (likes && likes.length > 0) {
      votes.likes = likes;
    } else {
      votes.likes = [];
    }

    const [dislikes] = await promisePool.execute<RowDataPacket[] & PostVote[]>(
      'SELECT * FROM PostVotes WHERE post_id = ? AND approve = 0',
      [postId]
    );
    console.log('dislikes', dislikes);
    if (dislikes && dislikes.length > 0) {
      votes.dislikes = dislikes;
    } else {
      votes.dislikes = [];
    }
    return votes;
  } catch (e) {
    console.error('fetchLikesDislikesByPostId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get replies to post with post id from database.
 * This function fetches the relevant data for a PostWithAll type.
 * It includes the owner's username, subcategory name, profile picture, and votes.
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing all information about the media item
 * @throws {Error} - error if database query fails
 */
const fetchRepliesById = async (id: number): Promise<PostWithAll[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Posts
                WHERE reply_to=?
                ORDER BY created_at`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      sql,
      params
    );
    if (rows.length === 0) {
      return null;
    }

    const repliesWithOwners: PostWithAll[] = [];

    for (const row of rows) {
      const userId = row.user_id;

      const sql2 =
        'SELECT *, CONCAT(?, filename) AS filename FROM ProfilePictures WHERE user_id = ?';
      const [profPic] = await promisePool.execute<
        RowDataPacket[] &
          Pick<ProfilePicture, 'filename' | 'filesize' | 'media_type'>[]
      >(sql2, [uploadPath, userId]);

      const votes = await fetchLikesDislikesByPostId(row.post_id);

      const [owner] = await promisePool.execute<
        RowDataPacket[] & Pick<User, 'username'>[]
      >('SELECT username FROM Users WHERE user_id = ?', [userId]);
      if (owner.length === 0) {
        return null;
      }

      const subcatId = row.subcategory_id;
      const sql3 = 'SELECT title FROM Subcategories WHERE subcategory_id = ?';
      const [subcatName] = await promisePool.execute<
        RowDataPacket[] & Pick<Subcategory, 'title'>[]
      >(sql3, [subcatId]);
      if (subcatName.length === 0) {
        console.log('subcat title error');
        return null;
      }

      if (profPic.length !== 0) {
        repliesWithOwners.push({
          ...row,
          profile_picture: {
            filename: profPic[0].filename,
            filesize: profPic[0].filesize,
            media_type: profPic[0].media_type,
          },
          votes: {
            likes: votes.likes,
            dislikes: votes.dislikes,
          },
          username: owner[0].username,
          subcategory_name: subcatName[0].title,
        });
      } else {
        repliesWithOwners.push({
          ...row,
          votes: {
            likes: votes.likes,
            dislikes: votes.dislikes,
          },
          username: owner[0].username,
          subcategory_name: subcatName[0].title,
        });
      }
    }
    return repliesWithOwners;
  } catch (e) {
    console.error('fetchRepliesById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get post owner by post id from database
 * This function fetches the relevant data for a User type.
 * It includes the user_id and username.
 * 
 * @param {number} postId - id of the post
 * @returns {object} - object containing the username and ID of the user
 * @throws {Error} - error if database query fails 
 */
const fetchPostOwner = async (postId: Number): Promise<Pick<User, 'user_id' | 'username'> | null> => {
  try {
    const [rows] = await promisePool.execute<ResultSetHeader & Pick<User, 'user_id' | 'username'>[]>(
      'SELECT user_id, username FROM Users WHERE user_id = (SELECT user_id FROM Posts WHERE post_id = ?)',
      [postId]
    );
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (e) {
    console.error('fetchPostOwner error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get preview of latest post in subcategory listing from database
 * This function fetches the relevant data for a PostInSubcatListing type.
 * It includes the username of the post owner, the creation date of the post,
 * and the original post ID and title.
 *
 * @param {number} subcatId - id of the subcategory
 * @returns {object} - object containing the username, creation date, and original post ID and title
 * @throws {Error} - error if database query fails
 */
const fetchLatestPostListed = async (
  subcatId: number
): Promise<PostInSubcatListing | null> => {
  let data: PostInSubcatListing;
  let ogData: PostIDandTitle;

  try {
    const latest = await fetchNewestPostFromSubcategory(subcatId);
    console.log('latest', latest);
    if (!latest) {
      return null;
    }
    const postId = latest.post_id;
    const replyTo = await promisePool.execute<RowDataPacket[] & Post>(
      'SELECT * FROM Posts WHERE post_id = ?',
      [postId]
    );
    console.log('reply to', replyTo[0]);

    if (replyTo[0][0].reply_to === null) {
      const [postInfo] = await promisePool.execute<
        RowDataPacket[] & Pick<Post, 'created_at' | 'title'>
      >('SELECT created_at, title FROM Posts WHERE post_id = ?', [postId]);
      const [postOwner] = await promisePool.execute<
        RowDataPacket[] & Pick<User, 'username'>
      >(
        'SELECT username FROM Users WHERE user_id = (SELECT user_id FROM Posts WHERE post_id = ?)',
        [postId]
      );

      console.log(postInfo[0], postOwner[0]);
      if (!postInfo || !postOwner) {
        return null;
      }
      ogData = {
        post_id: postId,
        title: postInfo[0].title,
      };
      data = {
        username: postOwner[0].username,
        created_at: postInfo[0].created_at,
        original: ogData,
      };
    } else {
      const [postInfo] = await promisePool.execute<
        RowDataPacket[] & Pick<Post, 'created_at'>
      >('SELECT created_at FROM Posts WHERE post_id = ?', [postId]);
      const [postOwner] = await promisePool.execute<
        RowDataPacket[] & Pick<User, 'username'>
      >(
        'SELECT username FROM Users WHERE user_id = (SELECT user_id FROM Posts WHERE post_id = ?)',
        [postId]
      );
      const [originalPostInfo] = await promisePool.execute<
        RowDataPacket[] & Pick<Post, 'post_id' | 'title'>
      >('SELECT post_id, title FROM Posts WHERE post_id = ?', [
        replyTo[0][0].reply_to,
      ]);

      if (!postInfo || !postOwner || !originalPostInfo) {
        return null;
      }
      ogData = {
        post_id: originalPostInfo[0].post_id,
        title: originalPostInfo[0].title,
      };
      data = {
        username: postOwner[0].username,
        created_at: postInfo[0].created_at,
        original: ogData,
      };
    }
    return data;
  } catch (e) {
    console.error('fetchLatestPostListed error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Check if post is a reply to another post
 * 
 * @param {number} postId - id of the post
 * @returns {object} - object containing the reply_to value of the post
 * @throws {Error} - error if database query fails
 */
const checkIfReply = async (
  postId: number
): Promise<Pick<Post, 'reply_to'> | MessageResponse | null> => {
  try {
    const [rows] = await promisePool.execute<
      ResultSetHeader & Pick<Post, 'reply_to'>
    >('SELECT reply_to FROM Posts WHERE post_id = ?;', [postId]);
    console.log(rows);
    if (!rows) {
      return null;
    }
    if (rows.reply_to === null) {
      return {message: 'Not a reply'};
    }
    return rows;
  } catch (e) {
    console.error('checkIfReply error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Add new media item to database.
 * This function is used for adding original posts.
 * Files are uploaded to the upload server and the file data is saved to the database.
 * It is optional to add a file to the post.
 *
 * @param {object} media - object containing all information about the new media item
 * @returns {object} - object containing id of the inserted media item in db
 * @throws {Error} - error if database query fails
 */
const createNewPost = async (
  post: NewPostWithFile | NewPostWithoutFile,
  userId: number
): Promise<Post | null> => {
  console.log('media item', post);
  if ('filename' in post) {
    const {
      subcategory_id,
      title,
      text_content,
      filename,
      filesize,
      media_type,
    } = post;

    const sql = `INSERT INTO Posts (user_id, subcategory_id, filename, filesize, media_type, title, text_content)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      userId,
      subcategory_id,
      filename,
      filesize,
      media_type,
      title,
      text_content,
    ];

    try {
      const uploadPath = process.env.UPLOAD_URL;
      const result = await promisePool.execute<ResultSetHeader>(sql, params);
      console.log('result', result);
      const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
        'SELECT *, CONCAT(?, filename) AS filename, CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail FROM Posts WHERE post_id = ?',
        [uploadPath, uploadPath, result[0].insertId]
      );
      console.log(rows);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (e) {
      console.error('error', (e as Error).message);
      throw new Error((e as Error).message);
    }
  } else {
    const {subcategory_id, title, text_content, reply_to} = post;
    let sql = '';
    const params = [userId, subcategory_id, title, text_content];
    if (reply_to) {
      params.push(reply_to);
      sql = `INSERT INTO Posts (user_id, subcategory_id, title, text_content, reply_to)
                VALUES (?, ?, ?, ?, ?)`;
    } else {
      sql = `INSERT INTO Posts (user_id, subcategory_id, title, text_content)
                VALUES (?, ?, ?, ?)`;
    }
    try {
      console.log('sql', sql, 'params', params);
      const result = await promisePool.execute<ResultSetHeader>(sql, params);
      console.log('result', result);
      const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
        'SELECT * FROM Posts WHERE post_id = ?',
        [result[0].insertId]
      );
      if (rows.length === 0) {
        return null;
      }
      console.log(rows[0]);
      return rows[0];
    } catch (e) {
      console.error('error', (e as Error).message);
      throw new Error((e as Error).message);
    }
  }
};

/**
 * Add new reply to database.
 * This function is used for adding replies to original posts.
 * For replies, the required fields are subcategory_id, text_content, and reply_to.
 * You can't add a file or a title to a reply.
 * 
 * @param {object} post - object containing all information about the new reply
 * @returns {object} - object containing id of the inserted reply in db
 * @throws {Error} - error if database query fails
 */
const makeNewReply = async (
  post: NewPostWithoutFile,
  userId: number
): Promise<Post | null> => {
  const {subcategory_id, text_content, reply_to} = post;
  const sql = `INSERT INTO Posts (user_id, subcategory_id, text_content, reply_to)
               VALUES (?, ?, ?, ?)`;
  const params = [userId, subcategory_id, text_content, reply_to];
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
 * Update post in database.
 * This function is used for editing posts.
 * You can edit the title, text content, or file of a post.
 *
 * @param {object} media - EditedPost or EditPostWithFile object containing updated information
 * @param {number} userId - id of the user
 * @param {number} postId - id of the post
 * @returns {object} - object containing id of the updated post in db
 * @throws {Error} - error if database query fails
 */

const putMedia = async (
  media: EditedPost | EditPostWithFile,
  userId: number,
  postId: number
): Promise<Post> => {
  try {
    console.log('media object', media);
    const sql = promisePool.format(
      'UPDATE Posts SET ? WHERE user_id = ? AND post_id = ?',
      [media, userId, postId]
    );
    const result = await promisePool.execute<ResultSetHeader>(sql);
    if (result[0].affectedRows === 0) {
      throw new Error('Post not updated');
    }
    console.log('result', result);
    const [rows] = await promisePool.execute<RowDataPacket[] & Post[]>(
      'SELECT * FROM Posts WHERE post_id = ?',
      [postId]
    );
    console.log(rows[0]);
    return rows[0];
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete post from database.
 * This function is used for deleting posts.
 * You can only delete posts that you own.
 * If the post has a file, it is also deleted from the upload server.
 *
 * @param {number} id - id of the post
 * @returns {object} - object containing id of the deleted post in db
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

  // remove environment variable UPLOAD_URL from filename
  if (media.filename) {
    media.filename = media?.filename.replace(
      process.env.UPLOAD_URL as string,
      ''
    );
  }

  console.log('filename changed', media.filename);
  console.log(token);
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM PostVotes WHERE post_id = ?;', [id]);

    await connection.execute(
      'DELETE FROM PostVotes WHERE post_id = (SELECT post_id FROM Posts WHERE reply_to = ?);',
      [id]
    );

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
      process.env.UPLOAD_SERVER + '/delete/' + media.filename,
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

export {
  fetchAllPosts,
  fetchAllOriginalPosts,
  fetchPostsBySubcat,
  fetchPostById,
  fetchRepliesById,
  fetchLikesDislikesByPostId,
  fetchPostOwner,
  fetchLatestPostListed,
  checkIfReply,
  createNewPost,
  makeNewReply,
  deletePost,
  putMedia,
};
