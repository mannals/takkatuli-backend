import express from 'express';
import {
  getAllPosts,
  getPost,
  getPostOwner,
  getRepliesByPost,
  mediaDelete,
  makePost,
  makeReply,
  getVotesByPost,
  putPost,
} from '../controllers/mediaController';
import {authenticate} from '../../middlewares';
import {
  myVotesGet,
  voteDelete,
  voteGet,
  votePost,
} from '../controllers/voteController';

const mediaRoute = express.Router();

/*
 * GET /api/posts
 * Get all posts
 * POST /api/posts
 * Create new post
 */
mediaRoute.route('/').get(getAllPosts).post(authenticate, makePost);

/*
 * GET /api/posts/votes
 * Get all votes of a user
 */
mediaRoute.route('/votes').get(myVotesGet);

/*
 * GET /api/posts/:id
 * Get post by id
 * DELETE /api/posts/:id
 * Delete post by id
 * POST /api/posts/:id
 * Create reply to post
 * PUT /api/posts/:id
 * Update post by id
 */
mediaRoute
  .route('/:id')
  .get(getPost)
  .delete(authenticate, mediaDelete)
  .post(authenticate, makeReply)
  .put(authenticate, putPost);

/*
 * GET /api/posts/:id/vote
 * Get vote of a user on a post
 * POST /api/posts/:id/vote
 * Add vote to post
 * DELETE /api/posts/:id/vote
 * Delete vote from post
 */
mediaRoute
  .route('/:id/vote')
  .get(authenticate, voteGet)
  .post(authenticate, votePost)
  .delete(authenticate, voteDelete);

/*
 * GET /api/posts/:id/votes
 * Get all votes of a post
 * GET /api/posts/:id/replies
 * Get all replies of a post
 */
mediaRoute.route('/:id/votes').get(getVotesByPost);

/*
 * GET /api/posts/:id/replies
 * Get all replies of a post
 */
mediaRoute.route('/:id/replies').get(getRepliesByPost);

/*
 * GET /api/posts/owner/:id
 * Get owner of post by post id
 */
mediaRoute.route('/owner/:id').get(getPostOwner);

export default mediaRoute;
