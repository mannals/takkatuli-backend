import express from 'express';
import {getVotesByPost, myVotesGet, voteDelete, voteGet, votePost} from '../controllers/voteController';
import {authenticate} from '../../middlewares';

const voteRoute = express.Router();

/**
 * @api {get} /api/votes Get all votes of a user
 * @apiName GetMyVotes
 * @apiGroup Votes
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSuccess {Votes} votes List of votes
 * @apiSuccess {PostVote[]} votes List of votes
 * @apiSuccess {Number} votes.vote_id Vote ID
 * @apiSuccess {Number} votes.post_id Post ID of liked post
 * @apiSuccess {Number} votes.user_id User ID of voter
 * @apiSuccess {Boolean} votes.approve Like or dislike
 * @apiSuccess {Date} votes.created_at Vote creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  [
 *   {
 *    "vote_id": 1,
 *    "post_id": 1,
 *    "user_id": 1,
 *    "approve": true,
 *    "created_at": "2021-08-01T12:00:00.000Z"
 *   },
 *   {
 *    "vote_id": 2,
 *    "post_id": 2,
 *    "user_id": 1,
 *    "approve": false,
 *    "created_at": "2021-08-01T12:00:00.000Z"
 *   }
 * ]
 */
voteRoute.route('/').get(myVotesGet);

/**
 * @api {get} /api/votes/:id Get my vote by post ID
 * @apiName GetMyVote
 * @apiGroup Votes
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {PostVote} vote Vote
 * @apiSuccess {Number} vote.vote_id Vote ID
 * @apiSuccess {Number} vote.post_id Post ID of liked post
 * @apiSuccess {Number} vote.user_id User ID of voter
 * @apiSuccess {Boolean} vote.approve Like or dislike
 * @apiSuccess {Date} vote.created_at Vote creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "vote_id": 1,
 *     "post_id": 1,
 *     "user_id": 1,
 *     "approve": true,
 *     "created_at": "2021-08-01T12:00:00.000Z"
 *   }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 *  {
 *    "message": "No vote found"
 *  }
 */
voteRoute.route('/:id').get(authenticate, voteGet);

/**
 * @api {post} /api/votes/:id Add vote to post
 * @apiName AddVote
 * @apiGroup Votes
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Message} message Vote created
 * @apiSuccess {PostVote} vote Created vote
 * @apiSuccess {Number} vote.vote_id Vote ID
 * @apiSuccess {Number} vote.post_id Post ID of liked post
 * @apiSuccess {Number} vote.user_id User ID of voter
 * @apiSuccess {Boolean} vote.approve Like or dislike
 * @apiSuccess {Date} vote.created_at Vote creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "message": "Vote created",
 *    "vote": {
 *              "vote_id": 1,
 *              "post_id": 1,
 *              "user_id": 1,
 *              "approve": true,
 *              "created_at": "2021-08-01T12:00:00.000Z"
 *            }
 *  }
 */
voteRoute.route('/:id').post(authenticate, votePost);

/**
 * @api {delete} /api/votes/:id Delete vote from post
 * @apiName DeleteVote
 * @apiGroup Votes
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Message} message Vote deleted
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message": "Vote deleted"
 *   }
 */
voteRoute.route('/:id').delete(authenticate, voteDelete);

/**
 * @api {get} /api/votes/:id/all Get votes by post ID
 * @apiName GetVotesByPost
 * @apiGroup Votes
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Votes} votes List of votes
 * @apiSuccess {PostVote[]} votes.likes List of likes
 * @apiSuccess {Number} votes.likes.vote_id Vote ID
 * @apiSuccess {Number} votes.likes.post_id Post ID of liked post
 * @apiSuccess {Number} votes.likes.user_id User ID of voter
 * @apiSuccess {Boolean} votes.likes.approve Like or dislike
 * @apiSuccess {Date} votes.likes.created_at Vote creation date
 * @apiSuccess {PostVote[]} votes.dislikes List of dislikes
 * @apiSuccess {Number} votes.dislikes.vote_id Vote ID
 * @apiSuccess {Number} votes.dislikes.post_id Post ID of liked post
 * @apiSuccess {Number} votes.dislikes.user_id User ID of voter
 * @apiSuccess {Boolean} votes.dislikes.approve Like or dislike
 * @apiSuccess {Date} votes.dislikes.created_at Vote creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "likes": [
 *       {
 *         "vote_id": 1,
 *         "post_id": 1,
 *         "user_id": 1,
 *         "approve": true,
 *         "created_at": "2021-08-01T12:00:00.000Z"
 *       },
 *       {
 *         "vote_id": 2,
 *         "post_id": 1,
 *         "user_id": 2,
 *         "approve": true,
 *         "created_at": "2021-08-01T12:00:00.000Z"
 *       }
 *     ],
 *     "dislikes": [
 *       {
 *         "vote_id": 3,
 *         "post_id": 1,
 *         "user_id": 3,
 *         "approve": false,
 *         "created_at": "2021-08-01T12:00:00.000Z"
 *       },
 *       {
 *         "vote_id": 4,
 *         "post_id": 1,
 *         "user_id": 4,
 *         "approve": false,
 *         "created_at": "2021-08-01T12:00:00.000Z"
 *       }
 *     ]
 *  }
 * 
 */
voteRoute.route('/:id/all').get(getVotesByPost);

export default voteRoute;