import express from 'express';
import {
  getAllCategories,
  getCategorySubcats,
  getCatsWithSubcatsAndLatest,
} from '../controllers/categoryController';

const categoryRoute = express.Router();

/*
 * GET /api/categories
 * Get all categories
 */
categoryRoute.route('/').get(getAllCategories);

/*
 * GET /api/categories/frontpage
 * Get all categories with subcategories and previews of latest posts
 */
categoryRoute.route('/frontpage').get(getCatsWithSubcatsAndLatest);

/*
 * GET /api/categories/:category_id/subcats
 * Get all subcategories of a category
 */
categoryRoute.route('/:category_id/subcats').get(getCategorySubcats);

export default categoryRoute;
