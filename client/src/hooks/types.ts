export type Post = {
  id: number;
  title: string;
  body: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  userId: number;
  user: { username: string };
};
