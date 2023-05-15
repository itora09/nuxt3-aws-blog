import dynamoose from 'dynamoose'
import { Item } from 'dynamoose/dist/Item'
import { commonDate } from './commonSchema'

export interface Article extends Item {
  pk: 'Article'
  firstPublishedAt: number
  id: string
  _id: string
  _sys: {
    raw: {
      createdAt: string
      updatedAt: string
      firstPublishedAt: string
      publishedAt: string
    }
    createdAt: string
    updatedAt: string
  }
  title: string
  slug: string
  meta: {
    title: string
    description: string
    ogImage: string | null
  }
  body: string
  coverImage: string | null
  author: string | null
  categories: string[]
}

export const ArticleSchema = new dynamoose.Schema({
  pk: {
    type: String,
    hashKey: true,
  },
  firstPublishedAt: {
    type: Number,
    rangeKey: true,
  },
  id: {
    type: String,
    index: {
      type: 'global',
    },
  },
  _id: String,
  _sys: {
    type: Object,
    schema: {
      raw: {
        type: Object,
        schema: {
          createdAt: commonDate,
          updatedAt: commonDate,
          firstPublishedAt: commonDate,
          publishedAt: commonDate,
        },
      },
      createdAt: commonDate,
      updatedAt: commonDate,
    },
  },
  title: String,
  slug: String,
  meta: {
    type: Object,
    schema: {
      title: String,
      description: String,
      ogImage: [String, dynamoose.type.NULL],
    },
  },
  body: String,
  coverImage: [String, dynamoose.type.NULL],
  author: [String, dynamoose.type.NULL],
  categories: {
    type: Array,
    schema: [String],
  },
})

export const ArticleModel = dynamoose.model<Article>('Blog', ArticleSchema)
