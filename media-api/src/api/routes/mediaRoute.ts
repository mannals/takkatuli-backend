import express from 'express';
import {
  getAllPosts,
  getPost,
  getPostOwner,
  getRepliesByPost,
  mediaDelete,
  makePost,
  makeReply,
  putPost,
} from '../controllers/mediaController';
import {authenticate} from '../../middlewares';

const mediaRoute = express.Router();

/**
 * @api {get} /api/posts Get all posts
 * @apiName GetAllPosts
 * @apiGroup Posts
 * 
 * @apiSuccess {Post[]} posts List of posts
 * @apiSuccess {Number} posts.post_id Post ID
 * @apiSuccess {Number} posts.user_id User ID of post author
 * @apiSuccess {Number} posts.subcategory_id Subcategory ID of post
 * @apiSuccess {String} posts.filename Filename of post media
 * @apiSuccess {Number} posts.filesize Filesize of post media
 * @apiSuccess {String} posts.thumbnail Thumbnail of post media
 * @apiSuccess {String} posts.media_type Media type of post
 * @apiSuccess {Number} posts.reply_to Post ID of post this post is replying to
 * @apiSuccess {String} posts.title Post title
 * @apiSuccess {String} posts.text_content Post text content
 * @apiSuccess {Date} posts.created_at Post creation date
 * @apiSuccess {Date} posts.edited_at Post edit date
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *  [
 *   {
 *     "post_id": 1,
 *     "user_id": 1,
 *     "subcategory_id": 1,
 *     "filename": "media.jpg",
 *     "filesize": 1024,
 *     "thumbnail": "media_thumb.jpg",
 *     "media_type": "image/jpeg",
 *     "reply_to": null,
 *     "title": "Post title",
 *     "text_content": "Post text content",
 *     "created_at": "2021-08-01T12:00:00.000Z",
 *     "edited_at": null
 *   },
 *   {
 *     "post_id": 2,
 *     "user_id": 2,
 *     "subcategory_id": 1,
 *     "filename": "media2.jpg",
 *     "filesize": 2048,
 *     "thumbnail": "media2_thumb.jpg",
 *     "media_type": "image/jpeg",
 *     "reply_to": 1,
 *     "title": "Reply title",
 *     "text_content": "Reply text content",
 *     "created_at": "2021-08-01T12:00:00.000Z",
 *     "edited_at": null
 *   }
 * 
 */
mediaRoute.route('/').get(getAllPosts)

/**
 * @api {post} /api/posts Create post
 * @apiName CreatePost
 * @apiGroup Posts
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSuccess {Message} message Post created
 * @apiSuccess {Post} media Created post
 * @apiSuccess {Number} media.post_id Post ID
 * @apiSuccess {Number} media.user_id User ID of post author
 * @apiSuccess {Number} media.subcategory_id Subcategory ID of post
 * @apiSuccess {String} media.filename Filename of post media
 * @apiSuccess {Number} media.filesize Filesize of post media
 * @apiSuccess {String} media.thumbnail Thumbnail of post media
 * @apiSuccess {String} media.media_type Media type of post media
 * @apiSuccess {Number} media.reply_to Post ID of post this post is replying to
 * @apiSuccess {String} media.title Post title
 * @apiSuccess {String} media.text_content Post text content
 * @apiSuccess {Date} media.created_at Post creation date
 * @apiSuccess {Date} media.edited_at Post edit date
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *   "message": "Post created",
 *   "media": {
 *              "post_id": 1,
 *              "user_id": 1,
 *              "subcategory_id": 1,
 *              "filename": "media.jpg",
 *              "filesize": 1024,
 *              "thumbnail": "media_thumb.jpg",
 *              "media_type": "image/jpeg",
 *              "reply_to": null,
 *              "title": "Post title",
 *              "text_content": "Post text content",
 *              "created_at": "2021-08-01T12:00:00.000Z",
 *              "edited_at": null
 *            }
 * }
 */
mediaRoute.route('/').post(authenticate, makePost);

/**
 * @api {get} /api/posts/:id Get post by ID
 * @apiName GetPost
 * @apiGroup Posts
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Post} post Post
 * @apiSuccess {Number} post.post_id Post ID
 * @apiSuccess {Number} post.user_id User ID of post author
 * @apiSuccess {Number} post.subcategory_id Subcategory ID of post
 * @apiSuccess {String} post.filename Filename of post media
 * @apiSuccess {Number} post.filesize Filesize of post media
 * @apiSuccess {String} post.thumbnail Thumbnail of post media
 * @apiSuccess {String} post.media_type Media type of post media
 * @apiSuccess {Number} post.reply_to Post ID of post this post is replying to
 * @apiSuccess {String} post.title Post title
 * @apiSuccess {String} post.text_content Post text content
 * @apiSuccess {Date} post.created_at Post creation date
 * @apiSuccess {Date} post.edited_at Post edit date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "post_id": 1,
 *    "user_id": 1,
 *    "subcategory_id": 1,
 *    "filename": "media.jpg",
 *    "filesize": 1024,
 *    "thumbnail": "media_thumb.jpg",
 *    "media_type": "image/jpeg",
 *    "reply_to": null,
 *    "title": "Post title",
 *    "text_content": "Post text content",
 *    "created_at": "2021-08-01T12:00:00.000Z",
 *    "edited_at": null
 *  }
 */
mediaRoute.route('/:id').get(getPost);

/**
 * @api {delete} /api/posts/:id Delete post by ID
 * @apiName DeletePost
 * @apiGroup Posts
 * 
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Message} message Post deleted
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message": "Post deleted"
 *   }
 */
mediaRoute.route('/:id').delete(authenticate, mediaDelete);

/**
 * @api {post} /api/posts/:id/reply Reply to post
 * @apiName ReplyToPost
 * @apiGroup Posts
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Message} message Media created
 * @apiSuccess {Post} media Created post
 * @apiSuccess {Number} media.post_id Post ID
 * @apiSuccess {Number} media.user_id User ID of post author
 * @apiSuccess {Number} media.subcategory_id Subcategory ID of post
 * @apiSuccess {String} media.filename Filename of post media
 * @apiSuccess {Number} media.filesize Filesize of post media
 * @apiSuccess {String} media.thumbnail Thumbnail of post media
 * @apiSuccess {String} media.media_type Media type of post media
 * @apiSuccess {Number} media.reply_to Post ID of post this post is replying to
 * @apiSuccess {String} media.title Post title
 * @apiSuccess {String} media.text_content Post text content
 * @apiSuccess {Date} media.created_at Post creation date
 * @apiSuccess {Date} media.edited_at Post edit date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message": "Media created",
 *     "media": {
 *                "post_id": 1,
 *                "user_id": 1,
 *                "subcategory_id": 1,
 *                "filename": "media.jpg",
 *                "filesize": 1024,
 *                "thumbnail": "media_thumb.jpg",
 *                "media_type": "image/jpeg",
 *                "reply_to": 1,
 *                "title": "Reply title",
 *                "text_content": "Reply text content",
 *                "created_at": "2021-08-01T12:00:00.000Z",
 *                "edited_at": null
 *              }
 *   }
 */
mediaRoute.route('/:id').post(authenticate, makeReply);

/**
 * @api {put} /api/posts/:id Edit post by ID
 * @apiName EditPost
 * @apiGroup Posts
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Message} message Media edited
 * @apiSuccess {Post} media Edited post
 * @apiSuccess {Number} media.post_id Post ID
 * @apiSuccess {Number} media.user_id User ID of post author
 * @apiSuccess {Number} media.subcategory_id Subcategory ID of post
 * @apiSuccess {String} media.filename Filename of post media
 * @apiSuccess {Number} media.filesize Filesize of post media
 * @apiSuccess {String} media.thumbnail Thumbnail of post media
 * @apiSuccess {String} media.media_type Media type of post media
 * @apiSuccess {Number} media.reply_to Post ID of post this post is replying to
 * @apiSuccess {String} media.title Post title
 * @apiSuccess {String} media.text_content Post text content
 * @apiSuccess {Date} media.created_at Post creation date
 * @apiSuccess {Date} media.edited_at Post edit date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "message": "Media edited",
 *    "media": {
 *               "post_id": 1,
 *               "user_id": 1,
 *               "subcategory_id": 1,
 *               "filename": "media.jpg",
 *               "filesize": 1024,
 *               "thumbnail": "media_thumb.jpg",
 *               "media_type": "image/jpeg",
 *               "reply_to": null,
 *               "title": "Post title",
 *               "text_content": "Post text content",
 *               "created_at": "2021-08-01T12:00:00.000Z",
 *               "edited_at": "2021-08-01T12:00:00.000Z"
 *             }
 *  }
 */
mediaRoute.route('/:id').put(authenticate, putPost);

/**
 * @api {get} /api/posts/:id/replies Get replies to post by post ID
 * @apiName GetRepliesByPost
 * @apiGroup Posts
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {PostWithAll[]} replies List of replies
 * @apiSuccess {Number} replies.post_id Post ID
 * @apiSuccess {Number} replies.user_id User ID of post author
 * @apiSuccess {Number} replies.subcategory_id Subcategory ID of post
 * @apiSuccess {String} replies.filename Filename of post media
 * @apiSuccess {Number} replies.filesize Filesize of post media
 * @apiSuccess {String} replies.thumbnail Thumbnail of post media
 * @apiSuccess {String} replies.media_type Media type of post media
 * @apiSuccess {Number} replies.reply_to Post ID of post this post is replying to
 * @apiSuccess {String} replies.title Post title
 * @apiSuccess {String} replies.text_content Post text content
 * @apiSuccess {Date} replies.created_at Post creation date
 * @apiSuccess {Date} replies.edited_at Post edit date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *    "post_id": 2,
 *    "user_id": 2,
 *    "subcategory_id": 1,
 *    "filename": null,
 *    "filesize": null,
 *    "thumbnail": null,
 *    "media_type": null,
 *    "reply_to": 1,
 *    "title": "Reply title",
 *    "text_content": "Reply text content",
 *    "created_at": "2021-08-01T12:00:00.000Z",
 *    "edited_at": null
 *  },
 *  {
 *    "post_id": 3,
 *    "user_id": 3,
 *    "subcategory_id": 1,
 *    "filename": null,
 *    "filesize": null,
 *    "thumbnail": null,
 *    "media_type": null,
 *    "reply_to": 1,
 *    "title": "Reply title",
 *    "text_content": "Reply text content",
 *    "created_at": "2021-08-01T12:00:00.000Z",
 *    "edited_at": null
 *  }
 * ]
 */
mediaRoute.route('/:id/replies').get(getRepliesByPost);

/**
 * @api {get} /api/posts/owner/:id Get post owner by post ID
 * @apiName GetPostOwner
 * @apiGroup Posts
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {User} owner Post owner
 * @apiSuccess {Number} owner.user_id User ID
 * @apiSuccess {String} owner.username Username
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "user_id": 1,
 *     "username": "user1"
 *   }
 */
mediaRoute.route('/owner/:id').get(getPostOwner);

export default mediaRoute;
