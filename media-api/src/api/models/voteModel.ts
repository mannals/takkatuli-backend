import {PostVote} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';

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

export {getMyVotes, getMyVoteFromPost, addVoteToPost, removeVoteFromPost};
