import dynamoose from 'dynamoose'
import { Item } from 'dynamoose/dist/Item'
import { commonDate } from './commonSchema'

export interface Author extends Item {
  pk: 'Author'
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
  fullName: string
  profileImage: string | null
  biography: string
}

export const AuthorSchema = new dynamoose.Schema({
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
  fullName: String,
  profileImage: [String, dynamoose.type.NULL],
  biography: String,
})

export const AuthorModel = dynamoose.model<any>('Blog', AuthorSchema)
