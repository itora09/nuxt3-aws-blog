import { ArticleModel } from '../models/dynamoDB/Article'
import { ValidationZodError } from '../modules/error/ValidationZodError'
import {
  ArticleListRequest,
  ArticleListRequestSchema,
  Article,
} from '~/composables/repositories/articleRepository'

export const execute = async (data: Article, isDelete: boolean) => {
  isDelete ? await articleDelete(data) : await articleUpsert(data)
}

/**
 * 記事を削除する
 * 記事が無かった場合は何もせずに正常終了とする
 * @param data 記事情報
 */
const articleDelete = async (data: Article) => {
  await ArticleModel.delete({
    pk: 'Article',
    firstPublishedAt: new Date(data._sys.raw.firstPublishedAt).getTime(),
  })
}

/**
 * 記事を作成または更新する
 * @param data 記事情報
 */
const articleUpsert = async (data: Article) => {
  const id = `Article_${data._id}`
  const queryResult = await ArticleModel.query('id').eq(id).exec()

  if (queryResult[0] === undefined) {
    await ArticleModel.create({
      pk: 'Article',
      firstPublishedAt: new Date(data._sys.raw.firstPublishedAt).getTime(),
      categoriesString: data.categories.join(','),
      ...data,
      id,
    })
    return
  }

  const json = queryResult[0].toJSON()
  await ArticleModel.update({
    ...json,
    ...data,
    categoriesString: data.categories.join(','),
  })
}

/**
 * 一覧取得APIのバリデーションチェックを行う
 * @param data リクエストデータ
 */
export const validationListApi = (data: any): ArticleListRequest => {
  const result = ArticleListRequestSchema.safeParse(data)
  if (!result.success) throw new ValidationZodError(result.error)
  return data
}

export const getArticleList = (data: ArticleListRequest) => {
  const parseResult = ArticleListRequestSchema.parse(data)
  const limit = parseResult.limit
  const lastKey = parseResult.last_key

  let query = ArticleModel.query('pk').eq('Article').sort('descending')

  if (parseResult.category)
    query = query.where('categoriesString').contains(parseResult.category)
  if (lastKey)
    query = query.startAt({ pk: 'Article', firstPublishedAt: lastKey })
  return query.limit(limit).exec()
}
