export interface BlogData {
  title?: string;
  blogBody?: string;
  deletedAt?: Date;
}

export interface UpdateBlog {
  blogId: string;
  newData: BlogData;
}
