import {PostVote, Votes} from '@sharedTypes/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {
  addVoteToPost,
  fetchVotesByPostId,
  getMyVoteFromPost,
  getMyVotes,
  removeVoteFromPost,
} from '../models/voteModel';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import CustomError from '../../classes/CustomError';

/* GET MY VOTES */
const myVotesGet = async (
  req: Request,
  res: Response<PostVote[] | null>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const votes = await getMyVotes(userId);
    res.json(votes);
  } catch (error) {
    next(error);
  }
};

/* GET MY VOTE BY POST ID */
const voteGet = async (
  req: Request<{id: string}>,
  res: Response<PostVote | MessageResponse>,
  next: NextFunction
) => {
  try {
    const userId = parseInt(res.locals.user.user_id);
    const postId = parseInt(req.params.id);
    const vote = await getMyVoteFromPost(userId, postId);
    res.json(vote);
  } catch (error) {
    next(error);
  }
};

/* GET VOTES BY POST ID */
const getVotesByPost = async (
  req: Request<{id: string}>,
  res: Response<Votes>,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id);
    const votes = await fetchVotesByPostId(postId);
    if (votes === null) {
      const error = new CustomError('No votes found', 404);
      next(error);
      return;
    }
    res.json(votes);
  } catch (e) {
    next(e);
  }
};

/* ADD VOTE TO POST */
const votePost = async (
  req: Request<{id: string}>,
  res: Response<PostVote | MessageResponse>,
  next: NextFunction
) => {
  try {
    const userId = parseInt(res.locals.user.user_id);
    const postId = parseInt(req.params.id);
    const approve = req.body.approve;
    console.log('approval', approve);
    const newVote = await addVoteToPost(userId, postId, approve);
    if (newVote === null) {
      const error = new CustomError('Vote not created', 500);
      next(error);
      return;
    } else if ('message' in newVote) {
      res.json({message: newVote.message});
    } else {
      res.json(newVote);
    }
  } catch (error) {
    next(error);
  }
};

/* DELETE VOTE FROM POST */
const voteDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const userId = parseInt(res.locals.user.user_id);
    const postId = parseInt(req.params.id);
    const result = await removeVoteFromPost(userId, postId);
    if (result === null) {
      const error = new CustomError('Vote not deleted', 500);
      next(error);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {myVotesGet, voteGet, getVotesByPost, votePost, voteDelete};
