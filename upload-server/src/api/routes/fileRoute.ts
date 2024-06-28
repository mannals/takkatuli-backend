import express, {Request} from 'express';
import {deleteFile, uploadFile} from '../controllers/uploadController';
import multer, {FileFilterCallback} from 'multer';
import {authenticate, logFile, makeThumbnail} from '../../middlewares';

/* FILE FILTER */
const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.includes('image') || file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

/**
 * @api {post} /api/upload Upload a file
 * @apiName UploadFile
 * @apiGroup File
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {String} filename Filename of uploaded file
 * @apiSuccess {String} thumbnail Filename of thumbnail
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "message": "File uploaded",
 *    "filename": "file.jpg",
 *    "thumbnail": "file_thumb.jpg"
 *  }
 *
 * @apiError {String} message Error message
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 *  {
 *    "message": "file not valid"
 *  }
 */
router
  .route('/upload')
  .post(authenticate, upload.single('file'), logFile, makeThumbnail, uploadFile);

/**
 * @api {delete} /api/upload/delete/:filename Delete a file
 * @apiName DeleteFile
 * @apiGroup File
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} filename Filename of file to delete
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    "message": "file deleted"
 *  }
 *
 * @apiError {String} message Error message
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 *  {
 *    "message": "file not found"
 *  }
 */
router.route('/delete/:filename').delete(authenticate, deleteFile);

export default router;
