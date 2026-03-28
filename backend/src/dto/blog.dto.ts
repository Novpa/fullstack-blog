export class createBlogPayload {
  public readonly title: string;
  public readonly content: string;
  public readonly thumbnail: string;
  constructor(title: string, blogBody: string, thumbnail: string) {
    this.title = title;
    this.content = blogBody;
    this.thumbnail = thumbnail;
  }
}
