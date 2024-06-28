import {PostVote, Votes} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';

/** 
 * Fetches all votes made by a user.
 * 
 * @param {number} userId - The user_id of the user whose votes are to be fetched.
 * @returns {array} - an array of PostVote objects or null if no votes are found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const getMyVotes = async (userId: number): Promise<PostVote[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & PostVote[]>(
      'SELECT * FROM PostVotes WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('getMyVotes error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Fetches a vote made by a user on a post.
 * If no vote is found, a message is returned.
 * 
 * @param {number} userId - The user_id of the user whose vote is to be fetched.
 * @param {number} postId - The post_id of the post whose vote is to be fetched.
 * @returns {object} - A PostVote object or a MessageResponse object if no vote is found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const getMyVoteFromPost = async (
  userId: number,
  postId: number
): Promise<PostVote | MessageResponse> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & PostVote[]>(
      'SELECT * FROM PostVotes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    if (!rows || rows.length === 0) {
      return {message: 'No vote found'};
    }
    return rows[0];
  } catch (e) {
    console.error('getMyVoteFromPost error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/** 
 * Adds a vote to a post.
 * If the user has already voted, the vote is updated.
 * If the user has already voted the same way, the vote is removed.
 * 
 * @param {number} userId - The user_id of the user who is voting.
 * @param {number} postId - The post_id of the post being voted on.
 * @param {boolean} approve - Whether the user approves or disapproves of the post.
 * @returns {object} - A PostVote object or a MessageResponse object if the vote fails.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const addVoteToPost = async (
  userId: number,
  postId: number,
  approve: boolean
): Promise<PostVote | MessageResponse> => {
  try {
    // first check if user has already voted
    // if so, vote should be removed instead
    console.log('user id', userId, 'post id', postId, 'approval', approve);
    const existingVote = await getMyVoteFromPost(userId, postId);
    console.log('vote existence', existingVote);

    if (
      existingVote &&
      'approve' in existingVote &&
      existingVote.approve === approve
    ) {
      console.log('identical vote exists, removing');
      const removal = await removeVoteFromPost(userId, postId);
      return removal;
    } else if (
      existingVote &&
      'approve' in existingVote &&
      existingVote.approve !== approve
    ) {
      console.log('unidentical vote exists, updating');
      const result = await promisePool.execute<ResultSetHeader>(
        'UPDATE PostVotes SET approve = ? WHERE post_id = ? AND user_id = ?',
        [approve, postId, userId]
      );
      console.log(result);
      const [rows] = await promisePool.execute<RowDataPacket[] & PostVote[]>(
        'SELECT * FROM PostVotes WHERE vote_id = ?',
        [existingVote.vote_id]
      );
      console.log('rows', rows);
      return rows[0];
    } else if (existingVote && 'message' in existingVote) {
      console.log('no vote exists yet, creating');
      const result = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO PostVotes (post_id, user_id, approve) VALUES (?, ?, ?)',
        [postId, userId, approve]
      );
      console.log(result);
      const [rows] = await promisePool.execute<RowDataPacket[] & PostVote[]>(
        'SELECT * FROM PostVotes WHERE vote_id = ?',
        [result[0].insertId]
      );
      console.log('rows', rows);
      return rows[0];
    }
    return {message: 'Vote error'};
  } catch (e) {
    console.error('addVoteToPost error', (e as Error).message);
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
const fetchVotesByPostId = async (postId: number): Promise<Votes> => {
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
 * Removes a vote from a post.
 * 
 * @param {number} userId - The user_id of the user who is removing their vote.
 * @param {number} postId - The post_id of the post whose vote is being removed.
 * @returns {object} - A MessageResponse object.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const removeVoteFromPost = async (
  userId: number,
  postId: number
): Promise<MessageResponse> => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM PostVotes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    console.log('result', result);
    return {message: 'Vote removed'};
  } catch (e) {
    console.error('removeVoteFromPost error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {getMyVotes, getMyVoteFromPost, addVoteToPost, fetchVotesByPostId, removeVoteFromPost};
