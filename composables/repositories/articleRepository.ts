import { z } from 'zod'

export const ArticleSchema = z.object({
  _id: z.string(),
  _sys: z.object({
    raw: z.object({
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      firstPublishedAt: z.string().datetime(),
      publishedAt: z.string().datetime(),
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  title: z.string(),
  slug: z.string(),
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: z.string().nullable(),
  }),
  body: z.string(),
  coverImage: z.string().nullable(),
  author: z.string().nullable(),
  categories: z.array(z.string()),
})
export type Article = z.infer<typeof ArticleSchema>

export const ArticlePostRequestSchema = z.object({
  data: ArticleSchema,
  isDelete: z.boolean(),
})
export type ArticlePostRequest = z.infer<typeof ArticlePostRequestSchema>

export const ArticleListRequestSchema = z.object({
  limit: z.preprocess((v) => Number(v), z.number().min(1).max(20)),
  last_key: z.preprocess((v) => Number(v), z.number()).optional(),
  category: z.string(),
})
export type ArticleListRequest = z.infer<typeof ArticleListRequestSchema>
