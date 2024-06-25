import express from 'express';
import {authenticate} from '../../middlewares';
import {
  getProfPicImageById,
  getProfilePicture,
  getProfilePictureWithImage,
  putProfilePicture,
} from '../controllers/profilePictureController';

const profPicRoute = express.Router();

/**
 * @api {get} /api/profilePic Get YOUR OWN profile picture by user id
 * @apiName GetProfilePicture
 * @apiGroup ProfilePicture
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSuccess {ProfilePicture} profilePicture Profile picture object
 * @apiSuccess {Number} profilePicture.picture_id Picture ID
 * @apiSuccess {Number} profilePicture.user_id User ID
 * @apiSuccess {String} profilePicture.filename Filename
 * @apiSuccess {Number} profilePicture.filesize File size
 * @apiSuccess {String} profilePicture.media_type Media type
 * @apiSuccess {String} profilePicture.thumbnail Thumbnail URL
 * @apiSuccess {Date} profilePicture.created_at Picture creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "picture_id": 1,
 *    "user_id": 1,
 *    "filename": "profilepic.jpg",
 *    "filesize": 123456,
 *    "media_type": "image/jpeg",
 *    "thumbnail": "profilepic-thumbnail.jpg",
 *    "created_at": "2021-08-01T12:00:00.000Z"
 *  }
 */
profPicRoute.route('/').get(authenticate, getProfilePicture);


/**
 * @api {put} /api/profilePic Change profile picture by user id
 * @apiName ChangeProfilePicture
 * @apiGroup ProfilePicture
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSuccess {String} message Success message
 * @apiSuccess {ProfilePicture} media Profile picture object
 * @apiSuccess {Number} media.picture_id Picture ID
 * @apiSuccess {Number} media.user_id User ID
 * @apiSuccess {String} media.filename Filename
 * @apiSuccess {Number} media.filesize File size
 * @apiSuccess {String} media.media_type Media type
 * @apiSuccess {String} media.thumbnail Thumbnail URL
 * @apiSuccess {Date} media.created_at Picture creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "success",
 *   "media": {
 *              "picture_id": 1,
 *              "user_id": 1,
 *              "filename": "profilepic.jpg",
 *              "filesize": 123456,
 *              "media_type": "image/jpeg",
 *              "thumbnail": "profilepic-thumbnail.jpg",
 *              "created_at": "2021-08-01T12:00:00.000Z"
 *            }
 * }
 */
profPicRoute.route('/').put(authenticate, putProfilePicture);

/**
 * @api {get} /api/profilePic/image Get your own profile picture with working image url by user id
 * @apiName GetProfilePictureWithImage
 * @apiGroup ProfilePicture
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSuccess {ProfilePicture} profilePicture Profile picture object
 * @apiSuccess {Number} profilePicture.picture_id Picture ID
 * @apiSuccess {Number} profilePicture.user_id User ID
 * @apiSuccess {String} profilePicture.filename Filename
 * @apiSuccess {Number} profilePicture.filesize File size
 * @apiSuccess {String} profilePicture.media_type Media type
 * @apiSuccess {String} profilePicture.thumbnail Thumbnail URL
 * @apiSuccess {Date} profilePicture.created_at Picture creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "picture_id": 1,
 *    "user_id": 1,
 *    "filename": "http://URL.TO.UPLOAD-SERVER/profilepic.jpg",
 *    "filesize": 123456,
 *    "media_type": "image/jpeg",
 *    "thumbnail": "http://URL.TO.UPLOAD-SERVER/profilepic-thumbnail.jpg",
 *    "created_at": "2021-08-01T12:00:00.000Z"
 * }
 */
profPicRoute.route('/image').get(authenticate, getProfilePictureWithImage);

/**
 * @api {get} /api/profilePic/image/:id Get another user's profile picture with working image url by user id
 * @apiName GetProfPicImageById
 * @apiGroup ProfilePicture
 * 
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiParam {Number} id User ID
 * 
 * @apiSuccess {ProfilePicture} profilePicture Profile picture object
 * @apiSuccess {Number} profilePicture.picture_id Picture ID
 * @apiSuccess {Number} profilePicture.user_id User ID
 * @apiSuccess {String} profilePicture.filename Filename
 * @apiSuccess {Number} profilePicture.filesize File size
 * @apiSuccess {String} profilePicture.media_type Media type
 * @apiSuccess {String} profilePicture.thumbnail Thumbnail URL
 * @apiSuccess {Date} profilePicture.created_at Picture creation date
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "picture_id": 1,
 *    "user_id": 1,
 *    "filename": "http://URL.TO.UPLOAD-SERVER/profilepic.jpg",
 *    "filesize": 123456,
 *    "media_type": "image/jpeg",
 *    "thumbnail": "http://URL.TO.UPLOAD-SERVER/profilepic-thumbnail.jpg",
 *    "created_at": "2021-08-01T12:00:00.000Z"
 *  }
 */
profPicRoute.route('/image/:id').get(getProfPicImageById);

export default profPicRoute;
