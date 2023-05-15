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
      ...data,
      id,
    })
    return
  }

  const json = queryResult[0].toJSON()
  await ArticleModel.update({ ...json, ...data })
}

/**
 * 一覧取得APIのバリデーションチェックを行う
 * @param data リクエストデータ
 */
export const validationListApi = (data: ArticleListRequest) => {
  const result = ArticleListRequestSchema.safeParse(data)
  if (!result.success) throw new ValidationZodError(result.error)
}

export const getArticleList = async (data: ArticleListRequest) => {
  // TODO: 一覧APIの実装
  console.log(data)
  // const limit = data.limit
  // const offset = data.offset
  // const sort = data.sort
  // const category = data.category
  const query = await ArticleModel.query('pk').eq('Article').limit(1).exec()
  console.log(query)
  // ArticleModel.query().exec()
}
