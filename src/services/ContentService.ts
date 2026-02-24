import { ApiClient } from "@/services/ApiClient";
import { NewPost, Post, LinkPreview } from "@/services/content";

export class ContentService {
  constructor(private api: ApiClient) {}

  async create(post: NewPost, images: File[]): Promise<Post> {
    console.log("Submitting post:", post, images);
    const payload = ContentService.toMultipartPayload(post, images);
    const response = await this.api.post<Post>("/posts/create", payload);
    return response.data;
  }

  async list(author?: string, post_id?: string): Promise<Post[]> {
    const response = await this.api.get<Post[]>("/posts/list", {
      params: { author, post_id },
    });
    return response.data;
  }

  async previewLink(
    url: string,
  ): Promise<Omit<LinkPreview, "isLoading" | "error">> {
    const response = await this.api.post<
      Omit<LinkPreview, "isLoading" | "error">
    >("/posts/link-preview", { url });
    return response.data;
  }

  private static toMultipartPayload(post: NewPost, images: File[]): FormData {
    const formData = new FormData();
    formData.append("content", post.content);
    images.forEach((image) => {
      formData.append("images", image);
    });
    return formData;
  }
}
