export type User = {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  posts?: Post[];
  comments?: Comment[];
  likes?: Like[];
  information?: Information;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  likes: number;
  liked: boolean;
  name?: string;
  createdAt: string; // backend usually returns ISO string
  userId: number;
  likedBy?: Like[];
  user: { id: number; username: string | null };
};

export type Comment = {
  id: number;
  body: string;
  userId: number;
  postId: number;
  likedBy?: Like[];
  createdAt: string;
};

export type Like = {
  id: number;
  type?: "POST" | "COMMENT";
  userId: number;
  postId?: number;
  commentId?: number;
};

export type Information = {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  location?: string;
  birthDate?: string; // Date string from backend
  education?: string;
  skills?: Skill[];
};

export type Skill = {
  id: number;
  name: string;
  informationId: number;
};
