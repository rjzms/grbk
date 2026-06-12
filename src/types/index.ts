export interface UserPublic {
  id: string;
  username: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  tags: { name: string; slug: string }[];
  author: { username: string };
  createdAt: Date;
  publishedAt: Date | null;
}

export interface PostDetail extends PostSummary {
  content: string;
  updatedAt: Date;
  author: UserPublic;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
