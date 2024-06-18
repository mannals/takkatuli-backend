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
