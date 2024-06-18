import {NextFunction, Request, Response} from 'express';
import {ProfilePicture} from '@sharedTypes/DBTypes';
import CustomError from '../../classes/CustomError';
import {
  fetchProfilePicture,
  changeProfilePicture,
  fetchProfilePictureWithImage,
} from '../models/profilePictureModel';
import {MediaResponse} from '@sharedTypes/MessageTypes';

/* GET PROFILE PICTURE BY USER ID */
const getProfilePicture = async (
  req: Request,
  res: Response<ProfilePicture | null>,
  next: NextFunction
) => {
  const userId = parseInt(res.locals.user.user_id);
  try {
    const profilePicture = await fetchProfilePicture(userId);
    res.json(profilePicture);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* GET PROFILE PICTURE BY USER ID */
const getProfilePictureWithImage = async (
  req: Request,
  res: Response<ProfilePicture | null>,
  next: NextFunction
) => {
  const userId = parseInt(res.locals.user.user_id);
  try {
    const profilePicture = await fetchProfilePictureWithImage(userId);
    res.json(profilePicture);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* GET PROFILE PICTURE WITH WORKING IMAGE URL BY USER ID */
const getProfPicImageById = async (
  req: Request<{id: string}>,
  res: Response<ProfilePicture | null>,
  next: NextFunction
) => {
  console.log('getProfPicImageById');
  const userId = parseInt(req.params.id);
  console.log('userId', userId);
  try {
    const profilePicture = await fetchProfilePictureWithImage(userId);
    if (profilePicture === null) {
      next(new CustomError('Profile picture not found', 404));
      return;
    }
    console.log('found profile picture:', profilePicture);
    res.json(profilePicture);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* CHANGE PROFILE PICTURE BY USER ID */
const putProfilePicture = async (
  req: Request,
  res: Response<MediaResponse>,
  next: NextFunction
) => {
  console.log('putProfilePicture');
  const userId = res.locals.user.user_id;
  const filedata = req.body;
  console.log(req.body);

  try {
    const profilePicture = await changeProfilePicture(filedata, userId);
    if (profilePicture === null) {
      next(new CustomError('Profile picture not found', 404));
      return 'error';
    }
    res.json({message: 'success', media: profilePicture});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  getProfilePicture,
  getProfilePictureWithImage,
  getProfPicImageById,
  putProfilePicture,
};
