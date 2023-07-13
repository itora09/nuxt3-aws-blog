import { z } from 'zod'

export const AuthorSchema = z.object({
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
  fullName: z.string(),
  profileImage: z.string().nullable(),
  biography: z.string(),
})
export type Author = z.infer<typeof AuthorSchema>

export const AuthorPostRequestSchema = z.object({
  data: AuthorSchema,
  isDelete: z.boolean(),
})
export type AuthorPostRequest = z.infer<typeof AuthorPostRequestSchema>
