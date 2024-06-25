import express, {Request, Response} from 'express';

import mediaRoute from './routes/mediaRoute';
import categoryRoute from './routes/categoryRoute';
import subcategoryRoute from './routes/subcategoryRoute';
import profPicRoute from './routes/profilePicRoute';
import voteRoute from './routes/voteRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/posts', mediaRoute);
router.use('/categories', categoryRoute);
router.use('/subcategories', subcategoryRoute);
router.use('/votes', voteRoute);
router.use('/profile', profPicRoute);

export default router;
