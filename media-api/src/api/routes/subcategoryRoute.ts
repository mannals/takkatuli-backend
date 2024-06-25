import express from 'express';
import {
  getPostsFromSubcategory,
  getSubcatLatestPreview,
} from '../controllers/mediaController';
import {getSubcatById} from '../controllers/categoryController';

const subcategoryRoute = express.Router();

/**
 * @api {get} /api/subcategories/:id Get subcategory by id
 * @apiName GetSubcategoryById
 * @apiGroup Subcategories
 * 
 * @apiParam {Number} id Subcategory ID
 * 
 * @apiSuccess {Number} subcategory_id Subcategory ID
 * @apiSuccess {Number} category_id Category ID
 * @apiSuccess {String} title Subcategory title
 * @apiSuccess {String} description Subcategory description
 * @apiSuccess {Date} created_at Subcategory creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "subcategory_id": 1,
 *    "category_id": 1,
 *    "title": "Subcategory 1",
 *    "description": "Description of subcategory 1",
 *    "created_at": "2021-08-01T12:00:00.000Z"
 *  }
 */
subcategoryRoute.route('/:id').get(getSubcatById);

/**
 * @api {get} /api/subcategories/latest/:id Get preview of latest post from subcategory by id
 * @apiName GetSubcatLatestPreview
 * @apiGroup Subcategories
 * 
 * @apiParam {Number} id Subcategory ID
 * 
 * @apiSuccess {String} username Username of latest reply/post owner
 * @apiSuccess {Date} created_at Latest reply/post creation date
 * @apiSuccess {PostIDAndTitle} original Preview of original post
 * @apiSuccess {Number} original.post_id Original post ID
 * @apiSuccess {String} original.title Original post title
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "username": "user1",
 *    "created_at": "2021-08-01T12:00:00.000Z",
 *    "original": {
 *                  "post_id": 1,
 *                  "title": "Post title"
 *                }
 *  }
 */
subcategoryRoute.route('/latest/:id').get(getSubcatLatestPreview);

/**
 * @api {get} /api/subcategories/:id/posts Get posts from subcategory by id
 * @apiName GetPostsFromSubcategory
 * @apiGroup Subcategories
 * 
 * @apiParam {Number} id Subcategory ID
 * 
 * @apiSuccess {PostPreview[]} posts Array of post previews
 * @apiSuccess {Date} posts.created_at Post creation date
 * @apiSuccess {Number} posts.post_id Post ID
 * @apiSuccess {String} posts.title Post title
 * @apiSuccess {String} posts.username Username of post owner
 * @apiSuccess {PostWithOwner} posts.latest Latest reply/post preview
 * @apiSuccess {Date} posts.latest.created_at Latest reply/post creation date
 * @apiSuccess {String} posts.latest.username Username of latest reply/post owner
 * @apiSuccess {Number} posts.replies_count Amount of replies
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *    "created_at": "2021-08-01T12:00:00.000Z",
 *    "post_id": 1,
 *    "title": "Post title",
 *    "username": "user1",
 *    "latest": {
 *                "created_at": "2021-08-01T12:00:00.000Z",
 *                "username": "user2"
 *              },
 *    "replies_count": 1
 *  },
 *  {
 *    "created_at": "2021-08-01T12:00:00.000Z",
 *    "post_id": 2,
 *    "title": "Post title 2",
 *    "username": "user3",
 *    "latest": {
 *                "created_at": "2021-08-01T12:00:00.000Z",
 *                "username": "user4"
 *              },
 *    "replies_count": 2
 *  }
 * ]
 */
subcategoryRoute.route('/:id/posts').get(getPostsFromSubcategory);

export default subcategoryRoute;
