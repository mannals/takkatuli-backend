import express from 'express';
import {
  getPostsFromSubcategory,
  getSubcatLatestPreview,
} from '../controllers/mediaController';
import {getSubcatById} from '../controllers/categoryController';

const subcategoryRoute = express.Router();

/*
 * GET /api/subcategories/:id
 * Get subcategory by id
 */
subcategoryRoute.route('/:id').get(getSubcatById);

/*
 * GET /api/subcategories/latest/:id
 * Get latest post preview from subcategory by id
 */
subcategoryRoute.route('/latest/:id').get(getSubcatLatestPreview);

/*
 * GET /api/subcategories/:id/posts
 * Get posts from subcategory by id
 */
subcategoryRoute.route('/:id/posts').get(getPostsFromSubcategory);

export default subcategoryRoute;
