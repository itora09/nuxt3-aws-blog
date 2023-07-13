import dynamoose from 'dynamoose'
import { Item } from 'dynamoose/dist/Item'
import { commonDate } from './commonSchema'

export interface Category extends Item {
  pk: 'Category'
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
  name: string
  slug: string
}

export const CategorySchema = new dynamoose.Schema({
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
  _id: {
    type: String,
  },
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
  name: String,
  slug: String,
})

export const CategoryModel = dynamoose.model<Category>('Blog', CategorySchema)
