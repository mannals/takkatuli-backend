import { Post, PostVote, ProfilePicture, UserWithNoPassword, UserWithProfilePicture } from './DBTypes';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type MediaResponse = MessageResponse & {
  media: Post | Post[] | ProfilePicture | ProfilePicture[] | PostVote | PostVote[];
};

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
  user: UserWithProfilePicture;
};

type UserDeleteResponse = MessageResponse & {
  user: { user_id: number };
};

type AvailableResponse = Partial<MessageResponse> & {
  available?: boolean;
};

type BooleanResponse = MessageResponse & {
  success: boolean;
};

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
};

export type {
  MessageResponse,
  ErrorResponse,
  MediaResponse,
  LoginResponse,
  UploadResponse,
  UserResponse,
  UserDeleteResponse,
  AvailableResponse,
  BooleanResponse,
};