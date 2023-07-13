import { z } from 'zod'

export const CategorySchema = z.object({
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
})
export type Category = z.infer<typeof CategorySchema>

export const CategoryPostRequestSchema = z.object({
  data: CategorySchema,
  isDelete: z.boolean(),
})
export type CategoryPostRequest = z.infer<typeof CategoryPostRequestSchema>
