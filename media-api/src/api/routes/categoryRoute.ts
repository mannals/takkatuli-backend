import express from 'express';
import {
  getAllCategories,
  getCategorySubcats,
  getCatsWithSubcatsAndLatest,
} from '../controllers/categoryController';

const categoryRoute = express.Router();

/**
 * @api {get} /api/categories Get all categories
 * @apiName GetAllCategories
 * @apiGroup Categories
 * 
 * @apiSuccess {Category[]} categories List of categories
 * @apiSuccess {Number} categories.category_id Category ID
 * @apiSuccess {String} categories.title Category title
 * @apiSuccess {Date} categories.created_at Category creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *        {
 *          "category_id": 1,
 *          "title": "Category 1",
 *          "created_at": "2021-08-01T12:00:00.000Z"
 *        },
 *        {
 *          "category_id": 2,
 *          "title": "Category 2",
 *          "created_at": "2021-08-01T12:00:00.000Z"
 *        }
 *      ] 
 */
categoryRoute.route('/').get(getAllCategories);

/**
 * @api {get} /api/categories/frontpage Get all categories with subcategories and front page previews of latest posts
 * @apiName GetCategoriesWithSubcatsAndLatest
 * @apiGroup Categories
 * 
 * @apiSuccess {Category[]} categories List of categories
 * @apiSuccess {Number} categories.category_id Category ID
 * @apiSuccess {String} categories.title Category title
 * @apiSuccess {Date} categories.created_at Category creation date
 * @apiSuccess {Subcategory[]} categories.subcategories List of subcategories
 * @apiSuccess {Number} categories.subcategories.subcategory_id Subcategory ID
 * @apiSuccess {Number} categories.subcategories.category_id Category ID
 * @apiSuccess {String} categories.subcategories.title Subcategory title
 * @apiSuccess {String} categories.subcategories.description Subcategory description
 * @apiSuccess {Date} categories.subcategories.created_at Subcategory creation date
 * @apiSuccess {PostInSubcatListing} categories.subcategories.latest Latest post preview in subcategory
 * @apiSuccess {Date} categories.subcategories.latest.created_at Latest post or post reply creation date
 * @apiSuccess {String} categories.subcategories.latest.username Username of post author
 * @apiSuccess {PostIDAndTitle} categories.subcategories.latest.original 
 * @apiSuccess {Number} categories.subcategories.latest.original.post_id Post ID
 * @apiSuccess {String} categories.subcategories.latest.original.title Post title
 * 
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   [
 *    {
 *      "category_id": 1,
 *      "title": "Category 1",
 *      "created_at": "2021-08-01T12:00:00.000Z",
 *      "subcategories": [
 *        {
 *          "subcategory_id": 1,
 *          "category_id": 1,
 *          "title": "Subcategory 1",
 *          "description": "Description of subcategory 1",
 *          "created_at": "2021-08-01T12:00:00.000Z",
 *          "latest": {
 *                      "created_at": "2021-08-01T12:00:00.000Z",
 *                      "username": "user1",
 *                      "original": {
 *                                    "post_id": 1,
 *                                     "title": "Post 1"
 *                                  }
 *                    }
 *         },
 *        {
 *          "subcategory_id": 2,
 *          "category_id": 1,
 *          "title": "Subcategory 2",
 *          "description": "Description of subcategory 2",
 *          "created_at": "2021-08-01T12:00:00.000Z",
 *          "latest": {
 *                      "created_at": "2021-08-01T12:00:00.000Z",
 *                      "username": "user2",
 *                      "original": {
 *                                    "post_id": 2,
 *                                    "title": "Post 2"
 *                                  }
 *                    }
 * 
 *         }]
 *    },
 *    {
 *      "category_id": 2,
 *      "title": "Category 2",
 *      "created_at": "2021-08-01T12:00:00.000Z",
 *      "subcategories": [
 *        {
 *          "subcategory_id": 3,
 *          "category_id": 2,
 *          "title": "Subcategory 3",
 *          "description": "Description of subcategory 3",
 *          "created_at": "2021-08-01T12:00:00.000Z",
 *          "latest": {
 *                      "created_at": "2021-08-01T12:00:00.000Z",
 *                      "username": "user3",
 *                      "original": {
 *                                    "post_id": 3,
 *                                    "title": "Post 3"
 *                                  }
 *                    }
 *        },
 *        {
 *          "subcategory_id": 4,
 *          "category_id": 2,
 *          "title": "Subcategory 4",
 *          "description": "Description of subcategory 4",
 *          "created_at": "2021-08-01T12:00:00.000Z",
 *          "latest": {
 *                      "created_at": "2021-08-01T12:00:00.000Z",
 *                      "username": "user4",
 *                      "original": {
 *                                    "post_id": 4,
 *                                    "title": "Post 4"
 *                                  }
 *                    }
 *        }
 *      ]
 *    }
 *   ]
 * 
 */
categoryRoute.route('/frontpage').get(getCatsWithSubcatsAndLatest);

/**
 * @api {get} /api/categories/:category_id/subcats Get subcategories by category ID
 * @apiName GetCategorySubcats
 * @apiGroup Categories
 * 
 * @apiParam {Number} category_id Category ID
 * 
 * @apiSuccess {Subcategory[]} subcategories List of subcategories
 * @apiSuccess {Number} subcategories.subcategory_id Subcategory ID
 * @apiSuccess {Number} subcategories.category_id Category ID
 * @apiSuccess {String} subcategories.title Subcategory title
 * @apiSuccess {String} subcategories.description Subcategory description
 * @apiSuccess {Date} subcategories.created_at Subcategory creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *  [
 *   {
 *     "subcategory_id": 1,
 *     "category_id": 1,
 *     "title": "Subcategory 1",
 *     "description": "Description of subcategory 1",
 *     "created_at": "2021-08-01T12:00:00.000Z"
 *   },
 *   {
 *     "subcategory_id": 2,
 *     "category_id": 1,
 *     "title": "Subcategory 2",
 *     "description": "Description of subcategory 2",
 *     "created_at": "2021-08-01T12:00:00.000Z"
 *   }
 *  ]
 */
categoryRoute.route('/:category_id/subcats').get(getCategorySubcats);

export default categoryRoute;
