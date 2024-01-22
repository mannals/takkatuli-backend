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

type Post = {
    post_id: number,
    user_id: number,
    category_id: number,
    filename: string | null,
    filesize: number | null,
    media_type: string | null,
    is_poll: boolean | null,
    reply_to: number | null,
    title: string,
    text_content: string,
    created_at: Date | string,
    edited_at: Date | string | null;
};

type PollOption = {
    option_id: number,
    post_id: number,
    title: string,
    created_at: Date | string,
    edited_at: Date | string | null;
}

type PollOptionVote = {
    vote_id: number,
    option_id: number,
    user_id: number,
    created_at: Date | string | null;
}

type PostVote = {
    vote_id: number,
    post_id: number,
    user_id: number,
    approve: boolean,
    created_at: Date | string;
};

type UploadResult = {
    message: string;
    data?: {
      image: string;
    };
};

type MostLikedPosts = Pick<
Post,
| 'post_id'
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

type PostWithOwner = Post & Pick<User, 'username'>;

type OriginalPost = Omit<Post, 'reply_to'>;

type PostWithoutPoll = Omit<Post, 'is_poll'>;

type FileInfo = {
    filename: string;
    user_id: number;
};

export type {
    UserLevel,
    User,
    Category,
    Post,
    PollOption,
    PollOptionVote,
    PostVote,
    UploadResult,
    MostLikedPosts,
    UserWithLevel,
    UserWithNoPassword,
    TokenContent,
    PostWithOwner,
    OriginalPost,
    PostWithoutPoll,
    FileInfo
};