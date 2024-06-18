import express from 'express';
import {authenticate} from '../../middlewares';
import {
  getProfPicImageById,
  getProfilePicture,
  getProfilePictureWithImage,
  putProfilePicture,
} from '../controllers/profilePictureController';

const profPicRoute = express.Router();

/*
 * GET /api/profilePic
 * Get profile picture by user id
 * PUT /api/profilePic
 * Change profile picture by user id
 */
profPicRoute
  .route('/')
  .get(authenticate, getProfilePicture)
  .put(authenticate, putProfilePicture);

/*
 * GET /api/profilePic/image
 * Get profile picture with working image url by user id
 */
profPicRoute.route('/image').get(authenticate, getProfilePictureWithImage);

/*
 * GET /api/profilePic/image/:id
 * Get ANOTHER USER'S profile picture with working image url by user id
 */
profPicRoute.route('/image/:id').get(getProfPicImageById);

export default profPicRoute;
