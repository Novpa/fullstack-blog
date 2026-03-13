export class createBlogPayload {
  public readonly authorId: string;
  public readonly title: string;
  public readonly blogBody: string;
  constructor(authorId: string, title: string, blogBody: string) {
    this.authorId = authorId;
    this.title = title;
    this.blogBody = blogBody;
  }
}
