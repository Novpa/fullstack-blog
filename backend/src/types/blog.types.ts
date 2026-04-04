export interface BlogData {
  title?: string;
  blogBody?: string;
  deletedAt?: Date;
}

export interface UpdateBlog {
  blogId: string;
  newData: BlogData;
  authorId: string;
}

export interface GetAllBlogParameter {
  page: number;
  limit: number;
  search?: string;
  createdAt?: Date;
}
