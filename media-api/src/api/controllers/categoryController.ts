import {Request, Response, NextFunction} from 'express';
import {Category, Subcategory} from '@sharedTypes/DBTypes';
import {
  fetchAllCategories,
  fetchAllCatsWithSubcatsAndLatest,
  fetchSubcategoriesByCategory,
  fetchSubcategoryById,
} from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

/* GET ALL CATEGORIES */
const getAllCategories = async (
  req: Request,
  res: Response<Category[]>,
  next: NextFunction
) => {
  try {
    const cats = await fetchAllCategories();
    if (cats === null) {
      const error = new CustomError('No categories found', 404);
      next(error);
      return;
    }
    res.json(cats);
  } catch (e) {
    next(e);
  }
};

/* GET ALL CATEGORIES WITH THEIR CORRESPONDING SUBCATEGORIES AND PREVIEWS OF LATEST POST */
const getCatsWithSubcatsAndLatest = async (
  req: Request,
  res: Response<Category[]>,
  next: NextFunction
) => {
  try {
    const cats = await fetchAllCatsWithSubcatsAndLatest();
    if (cats === null) {
      const error = new CustomError('No categories found', 404);
      next(error);
      return;
    }
    console.log(cats);
    res.json(cats);
  } catch (e) {
    next(e);
  }
};

/* GET SUBCATEGORIES BY CATEGORY ID */
const getCategorySubcats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cat_id = parseInt(req.params.category_id);
    const subcats = await fetchSubcategoriesByCategory(cat_id);
    if (subcats === null) {
      next(new CustomError('Subcategories not found', 404));
      return;
    }
    res.json(subcats);
  } catch (e) {
    next(e);
  }
};

/* GET SUBCATEGORY BY ID */
const getSubcatById = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('getSubcatById');
    const subcat_id = parseInt(req.params.id);
    const subcat = await fetchSubcategoryById(subcat_id);
    if (subcat === null) {
      next(new CustomError('Subcategory not found', 404));
      return;
    }
    console.log(subcat);
    res.json(subcat);
  } catch (e) {
    next(e);
  }
};

export {
  getAllCategories,
  getCatsWithSubcatsAndLatest,
  getCategorySubcats,
  getSubcatById,
};
