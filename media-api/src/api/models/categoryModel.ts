import {
  Category,
  Subcategory,
  Post,
  CategoryWithSubcategories,
  SubcatWithLatest,
} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {fetchLatestPostListed} from './mediaModel';

/** 
 * Fetches all categories from the database.
 * 
 * @returns {array} - an array of Category objects or null if no categories are found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchAllCategories = async (): Promise<Category[] | null> => {
  try {
    const sql = 'SELECT * FROM Categories;';
    const [rows] = await promisePool.execute<RowDataPacket[] & Category[]>(sql);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllCategories error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Fetches all categories with their subcategories 
 * and a preview of the latest post from each subcategory.
 * 
 * @returns {array} - an array of CategoryWithSubcategories objects or null if no categories are found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchAllCatsWithSubcatsAndLatest = async (): Promise<
  CategoryWithSubcategories[] | null
> => {
  try {
    const fullList: CategoryWithSubcategories[] = [];
    const sql = `
      SELECT * FROM Categories`;
    const [rows] = await promisePool.execute<RowDataPacket[] & Category[]>(sql);
    if (rows.length === 0) {
      return null;
    }
    console.log(rows);

    for (const cat of rows) {
      const subcats = await fetchSubcategoriesByCategory(cat.category_id);
      if (subcats === null) {
        continue;
      }
      console.log('subcats', subcats);
      const subcatList: SubcatWithLatest[] = [];
      for (const subcat of subcats) {
        const latestPost = await fetchLatestPostListed(subcat.subcategory_id);
        const subcatWithLatest: SubcatWithLatest = {
          ...subcat,
          latest: latestPost,
        };
        subcatList.push(subcatWithLatest);
      }
      const catWithSub: CategoryWithSubcategories = {
        ...cat,
        subcategories: subcatList,
      };
      fullList.push(catWithSub);
    }
    return fullList;
  } catch (e) {
    console.error(
      'fetchAllCatsWithSubcatsAndLatest error',
      (e as Error).message
    );
    throw new Error((e as Error).message);
  }
};

/**
 * Fetches the category of a post by its ID.
 * 
 * @param {number} postId - the ID of the post.
 * @returns {object} - a Category object or null if no category is found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchCategoryOfPost = async (
  postId: number
): Promise<Category | null> => {
  try {
    const sql =
      'SELECT * FROM Categories WHERE category_id = (SELECT category_id FROM Subcategories WHERE subcategory_id = (SELECT subcategory_id FROM Posts WHERE post_id = ?));';
    const [rows] = await promisePool.execute<ResultSetHeader & Category[]>(
      sql,
      postId
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchCategoryOfPost error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/** 
 * Fetches all subcategories of a category by its ID.
 * 
 * @param {number} category_id - the ID of the category.
 * @returns {array} - an array of Subcategory objects or null if no subcategories are found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchSubcategoriesByCategory = async (
  category_id: number
): Promise<Subcategory[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Subcategory[]>(
      'SELECT * FROM Subcategories WHERE category_id = ?;',
      [category_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchSubcategoriesByCategory error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Fetches a subcategory by its ID.
 * 
 * @param {number} subcatId - the ID of the subcategory.
 * @returns {object} - a Subcategory object or null if no subcategory is found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchSubcategoryById = async (
  subcatId: number
): Promise<Subcategory | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Subcategory[]>(
      'SELECT * FROM Subcategories WHERE subcategory_id = ?',
      [subcatId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchSubcategoryById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/** 
 * Fetches the subcategory of a post by its ID.
 * 
 * @param {number} postId - the ID of the post.
 * @returns {object} - a Subcategory object or null if no subcategory is found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchSubcategoryOfPost = async (
  postId: number
): Promise<Subcategory | null> => {
  try {
    const [rows] = await promisePool.execute<ResultSetHeader & Subcategory[]>(
      'SELECT * FROM Topics WHERE topic_id = (SELECT topic_id FROM Posts WHERE post_id = ?);',
      [postId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchTopicOfPost error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Fetches the newest original post from a subcategory by its ID.
 * 
 * @param {number} subcatId - the ID of the subcategory.
 * @returns {object} - a Post object or null if no post is found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchNewestOriginalPostFromSubcategory = async (
  subcatId: number
): Promise<Post | null> => {
  try {
    const [rows] = await promisePool.execute<ResultSetHeader & Post[]>(
      'SELECT * FROM Posts WHERE subcategory_id = ? AND reply_to IS NULL ORDER BY created_at DESC LIMIT 1;',
      [subcatId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error(
      'fetchNewestOriginalPostFromSubcategory error',
      (e as Error).message
    );
    throw new Error((e as Error).message);
  }
};

/**
 * Fetches the newest post from a subcategory by its ID.
 * This includes replies to other posts.
 * 
 * @param {number} subcatId - the ID of the subcategory.
 * @returns {object} - a Post object or null if no post is found.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const fetchNewestPostFromSubcategory = async (
  subcatId: number
): Promise<Post | null> => {
  try {
    const [rows] = await promisePool.execute<ResultSetHeader & Post[]>(
      'SELECT * FROM Posts WHERE subcategory_id = ? ORDER BY created_at DESC LIMIT 1;',
      [subcatId]
    );
    console.log('newest post from subcat', rows);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error(
      'fetchNewestOriginalPostFromSubcategory error',
      (e as Error).message
    );
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllCategories,
  fetchAllCatsWithSubcatsAndLatest,
  fetchCategoryOfPost,
  fetchSubcategoriesByCategory,
  fetchSubcategoryById,
  fetchSubcategoryOfPost,
  fetchNewestOriginalPostFromSubcategory,
  fetchNewestPostFromSubcategory,
};
