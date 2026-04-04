import * as z from "zod";

export const getAllBlogs = z.object({
  query: z
    .object({
      page: z.string(),
      limit: z.string(),
      search: z.string(),
      createdAt: z.coerce.date(),
    })
    .partial(),
});

export type getAllBlogs = z.infer<typeof getAllBlogs>["query"];
