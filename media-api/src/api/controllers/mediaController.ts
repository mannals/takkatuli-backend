import {Request, Response, NextFunction} from 'express';
import {
  deletePost,
  fetchAllOriginalPosts,
  fetchAllPosts,
  fetchLatestPostListed,
  fetchPostById,
  fetchPostOwner,
  fetchPostsBySubcat,
  createNewPost,
  fetchRepliesById,
  makeNewReply,
  fetchLikesDislikesByPostId,
  putMedia,
} from '../models/mediaModel';
import CustomError from '../../classes/CustomError';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {
  MakePost,
  NewPostWithFile,
  NewPostWithoutFile,
  Post,
  PostInSubcatListing,
  PostPreview,
  PostWithAll,
  TokenContent,
  User,
  Votes,
  EditedPost,
  EditPostWithFile,
} from '@sharedTypes/DBTypes';

/* GET ALL MEDIA */
const getAllPosts = async (
  req: Request,
  res: Response<Post[]>,
  next: NextFunction
) => {
  try {
    const media = await fetchAllPosts();
    if (media === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

/* GET ALL ORIGINAL POSTS (as in, not replies to other posts) */
const getOriginalPosts = async (
  req: Request,
  res: Response<Post[]>,
  next: NextFunction
) => {
  try {
    const media = await fetchAllOriginalPosts();
    if (media === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (e) {
    next(e);
  }
};

/* GET POST BY ID */
const getPost = async (
  req: Request<{id: string}>,
  res: Response<PostWithAll>,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const media = await fetchPostById(id);
    if (media === null) {
      const error = new CustomError('No post found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

/* GET POSTS BY SUBCATEGORY ID */
const getPostsFromSubcategory = async (
  req: Request<{id: string}>,
  res: Response<PostPreview[]>,
  next: NextFunction
) => {
  try {
    const subcat_id = parseInt(req.params.id);
    const posts = await fetchPostsBySubcat(subcat_id);
    if (posts === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(posts);
  } catch (e) {
    next(e);
  }
};

/* GET POST OWNER BY POST ID */
const getPostOwner = async (
  req: Request<{id: string}>,
  res: Response<User>,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id);
    const postOwner = await fetchPostOwner(postId);
    if (postOwner === null) {
      const error = new CustomError('No user found', 404);
      next(error);
      return;
    }
    res.json(postOwner);
  } catch (e) {
    next(e);
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
    const votes = await fetchLikesDislikesByPostId(postId);
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

/* GET REPLIES BY POST ID */
const getRepliesByPost = async (
  req: Request<{id: string}>,
  res: Response<PostWithAll[] | string>,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id);
    const replies = await fetchRepliesById(postId);
    if (replies === null) {
      const error = new CustomError('Error fetching replies', 404);
      next(error);
      return;
    }

    res.json(replies);
  } catch (e) {
    next(e);
  }
};

/* GET PREVIEW OF LATEST POST IN SUBCATEGORY */
const getSubcatLatestPreview = async (
  req: Request<{id: string}>,
  res: Response<PostInSubcatListing>,
  next: NextFunction
) => {
  try {
    const subcatId = parseInt(req.params.id);
    const latestPreview = await fetchLatestPostListed(subcatId);
    if (latestPreview === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(latestPreview);
  } catch (e) {
    next(e);
  }
};

/* CREATE NEW MEDIA */
const makePost = async (
  req: Request<{}, {}, NewPostWithFile | NewPostWithoutFile>,
  res: Response<MediaResponse>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    console.log('request body', req.body);
    console.log('user');
    const newMedia = await createNewPost(req.body, userId);
    if (newMedia === null) {
      const error = new CustomError('Media not created', 500);
      next(error);
      return;
    }
    res.json({message: 'Media created', media: newMedia});
  } catch (error) {
    next(error);
  }
};

/* CREATE NEW REPLY */
const makeReply = async (
  req: Request<{id: string}, {}, MakePost>,
  res: Response<MediaResponse>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const newMedia = await makeNewReply(req.body, userId);
    if (newMedia === null) {
      const error = new CustomError('Media not created', 500);
      next(error);
      return;
    }
    res.json({message: 'Media created', media: newMedia});
  } catch (error) {
    next(error);
  }
};

/* EDIT MEDIA */
const putPost = async (
  req: Request<{id: string}, {}, EditedPost | EditPostWithFile>,
  res: Response<MediaResponse>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const postId = parseInt(req.params.id);
    const editedMedia = await putMedia(req.body, userId, postId);
    if (editedMedia === null) {
      const error = new CustomError('Media not created', 500);
      next(error);
      return;
    }
    res.json({message: 'Media edited', media: editedMedia});
  } catch (error) {
    next(error);
  }
};

/* DELETE MEDIA */
const mediaDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent; token: string}>,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deletePost(id, res.locals.user, res.locals.token);
    if (result === null) {
      const error = new CustomError('Media not deleted', 500);
      next(error);
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getAllPosts,
  getOriginalPosts,
  getPost,
  getVotesByPost,
  getPostsFromSubcategory,
  getRepliesByPost,
  getSubcatLatestPreview,
  getPostOwner,
  makePost,
  makeReply,
  putPost,
  mediaDelete,
};
