import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {UserDeleteResponse, UserResponse} from '@sharedTypes/MessageTypes';
import {
  changeUserPassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserPassword,
  getUserWithProfilePicture,
  modifyUser,
} from '../models/userModel';
import {
  TokenContent,
  User,
  UserWithNoPassword,
  UserWithProfilePicture,
} from '@sharedTypes/DBTypes';
import {validationResult} from 'express-validator';

const salt = bcrypt.genSaltSync(12);

/* GET ALL USERS */
const userListGet = async (
  req: Request,
  res: Response<UserWithNoPassword[]>,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();

    if (users === null) {
      next(new CustomError('Users not found', 404));
      return;
    }
    res.json(users);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* GET USER BY ID */
const userGet = async (
  req: Request<{id: number}>,
  res: Response<UserWithNoPassword>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('userGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUserById(req.params.id);
    if (user === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* GET USER WITH PROFILE PICTURE BY ID */
const userProfPicGet = async (
  req: Request<{id: number}>,
  res: Response<UserWithProfilePicture>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('userGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUserWithProfilePicture(req.params.id);
    if (user === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* REGISTER USER */
const userPost = async (
  req: Request<{}, {}, Pick<User, 'username' | 'password' | 'email'>>,
  res: Response<UserResponse>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('userPost validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, salt);

    console.log(user);

    const newUser = await createUser(user);
    console.log('newUser', newUser);
    if (!newUser) {
      next(new CustomError('User not created', 500));
      return;
    }
    const response: UserResponse = {
      message: 'user created',
      user: newUser,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError('Duplicate entry', 200));
  }
};

/* EDIT USER DATA */
const userPut = async (
  req: Request<{}, {}, User>,
  res: Response<UserResponse, {user: UserWithProfilePicture}>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('userPut validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const userFromToken = res.locals.user;

    const user = req.body;
    if (user.password) {
      user.password = await bcrypt.hash(user.password, salt);
    }

    console.log('userPut', userFromToken, user);

    const result = await modifyUser(user, userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    console.log('put result', result);

    const response: UserResponse = {
      message: 'user updated',
      user: result,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* DELETE USER */
const userDelete = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    console.log('user from token', userFromToken);

    const result = await deleteUser(userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* CHANGE USER PASSWORD */
const userChangePassword = async (
  req: Request<{}, {}, {old_password: string; new_password: string}>,
  res: Response,
  next: NextFunction,
) => {
  console.log('userChangePassword');

  try {
    const userFromToken = res.locals.user;
    console.log('user from token', userFromToken);
    const confirmOldPassword = await getUserPassword(userFromToken.user_id);
    if (!confirmOldPassword) {
      next(new CustomError('User not found', 404));
      return;
    }

    if (!bcrypt.compareSync(req.body.old_password, confirmOldPassword)) {
      next(new CustomError('Incorrect password', 403));
      return;
    }

    const newPassword = await bcrypt.hash(req.body.new_password, salt);
    const result = await changeUserPassword(userFromToken.user_id, newPassword);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json({message: 'Password changed'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* GET USER BY TOKEN */
const checkToken = async (
  req: Request,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  const userFromToken = res.locals.user;
  // check if user exists in database
  const user = await getUserWithProfilePicture(userFromToken.user_id);
  if (!user) {
    next(new CustomError('User not found', 404));
    return;
  }

  const message: UserResponse = {
    message: 'Token is valid',
    user: user,
  };
  res.json(message);
};

/* EMAIL VALIDATION */
const checkEmailExists = async (
  req: Request<{email: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('checkEmailExists validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = await getUserByEmail(req.params.email);
    console.log(user);
    res.json({available: user ? false : true});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

/* USERNAME VALIDATION */
const checkUsernameExists = async (
  req: Request<{username: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('checkUsernameExists validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = await getUserByUsername(req.params.username);
    res.json({available: user ? false : true});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  userListGet,
  userGet,
  userProfPicGet,
  userPost,
  userPut,
  userDelete,
  userChangePassword,
  checkToken,
  checkEmailExists,
  checkUsernameExists,
};
