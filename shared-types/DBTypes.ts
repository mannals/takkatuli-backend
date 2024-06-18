export type UserLevel = {
  level_id: number;
  level_name: 'Admin' | 'User' | 'Guest';
};

export type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  bio_text: string | null;
  created_at: Date | string;
  edited_at: Date | string | null;
};

export type UpdateUser = {
  username: string;
  email: string;
  bio_text: string | null;
};

export type ProfilePicture = {
  picture_id: number;
  user_id: number;
  filename: string;
  filesize: number;
  media_type: string;
  thumbnail?: string;
  created_at: Date | string;
};

export type Category = {
  category_id: number;
  title: string;
  created_at: Date | string;
};

export type Subcategory = {
  subcategory_id: number;
  category_id: number;
  title: string;
  description: string;
  created_at: Date | string;
};

export type Post = {
  post_id: number;
  user_id: number;
  subcategory_id: number;
  filename: string | null;
  filesize: number | null;
  thumbnail: string | null;
  media_type: string | null;
  reply_to: number | null;
  title: string;
  text_content: string;
  created_at: Date | string;
  edited_at: Date | string | null;
};

export type PostVote = {
  vote_id: number;
  post_id: number;
  user_id: number;
  approve: boolean;
  created_at: Date | string;
};

export type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

export type Votes = {
  likes: PostVote[];
  dislikes: PostVote[];
};

export type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

export type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

export type UserWithProfilePicture = UserWithNoPassword & Pick<ProfilePicture, 'filename' | 'filesize' | 'media_type'>;

export type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

export type CategoryWithSubcategories = Category & {
  subcategories: SubcatWithLatest[] | null;
};

export type PostWithOwner = Post & Pick<User, 'username'>;

export type PostWithAll = Post & {
  profile_picture?: {
    filename?: string;
    filesize?: number;
    media_type?: string;
  };
  votes?: {
    likes: PostVote[];
    dislikes: PostVote[];
  };
  username: string;
  subcategory_name: string;
};

export type PostIDandTitle = Pick<Post, 'post_id' | 'title'>;

export type ReplyWithOriginal = PostWithOwner & {
  original: Pick<PostWithOwner, 'post_id' | 'username' | 'title'>;
};

export type PostInSubcatListing = Pick<PostWithOwner, 'created_at' | 'username'> & {
  original: PostIDandTitle;
};

export type PostPreview = Pick<Post, 'post_id' | 'title' | 'created_at'> & Pick<User, 'username'> & {
  latest: Pick<PostWithOwner, 'created_at' | 'username'>,
  replies_count: number,
};

export type SubcatWithLatest = Subcategory & {
  latest: PostInSubcatListing | null;
};

export type OriginalPost = Omit<Post, 'reply_to'>;

export type RepliesAmount = {
  count: number;
}

export type RepliesWithCount = {
  replies: ReplyWithOriginal[];
  count: number;
}

export type MakePost = {
  subcategory_id: number;
  title: string;
  text_content: string;
  file: File | null;
};

export type EditedPost = {
  title?: string;
  text_content?: string;
  file?: File | null;
};

export type EditPostWithFile = EditedPost & {
  filename: string;
  filesize: number;
  media_type: string;
};

export type FileData = {
  filename: string;
  filesize: number;
  media_type: string;
  uri?: string;
};

export type NewPostWithoutFile = {
  subcategory_id: number;
  title: string;
  text_content: string;
  reply_to?: number;
};

export type NewPostWithFile = NewPostWithoutFile & FileData;

export type FileInfo = {
  filename: string;
  user_id: number;
};
