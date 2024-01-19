import { Thread, UserWithNoPassword } from "./DBTypes";

type MessageResponse = {
    message: string;
};

type ErrorResponse = MessageResponse & {
    stack?: string;
};

type MediaResponse = MessageResponse & {
    media: Thread | Thread[];
};

// auth servevr
type LoginResponse = MessageResponse & {
    token: string,
    message: string,
    user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
    user: UserWithNoPassword;
};

type UserDeleteResponse = MessageResponse & {
    user: { user_id: number };
};

export type {
    MessageResponse,
    ErrorResponse,
    MediaResponse,
    LoginResponse,
    UserResponse,
    UserDeleteResponse,
};