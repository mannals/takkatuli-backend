/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from '@sharedTypes/MessageTypes';
import CustomError from './classes/CustomError';
import jwt from 'jsonwebtoken';
import {TokenContent} from '@sharedTypes/DBTypes';
import path from 'path';
import getVideoThumbnail from './utils/getVideoThumbnail';
import sharp from 'sharp';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error('errorHandler', err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('authenticate');
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new CustomError('Authentication failed', 401));
      return;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenContent;

    console.log(decodedToken);
    if (!decodedToken) {
      next(new CustomError('Authentication failed', 401));
      return;
    }

    res.locals.user = decodedToken;
    next();
  } catch (error) {
    next(new CustomError('Authentication failed', 401));
  }
};

const logFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    console.log('Uploaded file info:', req.file);
  } else {
    console.log('No file was uploaded.');
  }
  next(); // Proceed to the next middleware
};

const uploadsBasePath = path.join(__dirname, '..', '..', '..');

const makeThumbnail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('makeThumbnail', req.file);
    if (!req.file) {
      next(new CustomError('File not uploaded', 500));
      return;
    }

    const src = path.join(uploadsBasePath, 'uploads', req.file.filename);
    console.log(src);

    if (!req.file.mimetype.includes('video')) {
      await sharp(src)
        .resize(320, 240)
        .png()
        .toFile(src + '-thumb.png');
      next();
      return;
    }

    await getVideoThumbnail(src);
    next();
  } catch (error) {
    console.log((error as Error).message);
    next(new CustomError("Thumbnail not created", 500));
  }
};

export {notFound, errorHandler, authenticate, logFile, makeThumbnail};
