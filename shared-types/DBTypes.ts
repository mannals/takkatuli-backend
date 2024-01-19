type UserLevel = {
    level_id: number,
    level_name: 'Admin' | 'User' | 'Guest';
};

type User = {
    user_id: number,
    username: string,
    password: string,
    email: string,
    user_level_id: number,
    created_at: Date | string,
    edited_at: Date | string | null;
};

type Category = {
    category_id: number,
    title: string, 
    description: string,
    created_at: Date | string;
};

type Thread = {
    thread_id: number,
    user_id: number,
    category_id: number,
    filename: string | null,
    filesize: number | null,
    media_type: string | null,
    title: string,
    text_content: string,
    created_at: Date | string,
    edited_at: Date | string | null;
};

type ThreadLike = {
    like_id: number,
    thread_id: number,
    user_id: number,
    created_at: Date | string;
};

type Reply = {
    reply_id: number,
    thread_id: number,
    user_id: number,
    filename: string | null,
    filesize: number | null,
    media_type: string | null,
    reply_text: string,
    created_at: Date | string,
    edited_at: Date | string | null;
};

type ReplyLike = {
    like_id: number,
    reply_id: number,
    user_id: number,
    created_at: Date | string;
};

type UploadResult = {
    message: string;
    data?: {
      image: string;
    };
};

type MostLikedThreads = Pick<
Thread,
| 'thread_id'
| 'filename'
| 'filesize'
| 'media_type'
| 'title'
| 'text_content'
| 'created_at'
> &
Pick<User, 'user_id' | 'username' | 'email' | 'created_at'> & {
  likes_count: bigint;
};

type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

type ThreadWithOwner = Thread & Pick<User, 'username'>;

type FileInfo = {
    filename: string;
    user_id: number;
};

export type {
    UserLevel,
    User,
    Category,
    Thread,
    ThreadLike,
    Reply,
    ReplyLike,
    UploadResult,
    MostLikedThreads,
    UserWithLevel,
    UserWithNoPassword,
    TokenContent,
    ThreadWithOwner,
    FileInfo
};