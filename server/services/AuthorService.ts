import { AuthorModel } from '../models/dynamoDB/Author'
import { Author } from '~/composables/repositories/authorRepository'

export const execute = async (data: Author, isDelete: boolean) => {
  isDelete ? await authorDelete(data) : await authorUpsert(data)
}

/**
 * 著者を削除する
 * 著者が無かった場合は何もせずに正常終了とする
 * @param data 著者情報
 */
const authorDelete = async (data: Author) => {
  await AuthorModel.delete({
    pk: 'Author',
    firstPublishedAt: new Date(data._sys.raw.firstPublishedAt).getTime(),
  })
}

/**
 * 著者を作成または更新する
 * @param data 著者情報
 */
const authorUpsert = async (data: Author) => {
  const id = `Author_${data._id}`
  const queryResult = await AuthorModel.query('id').eq(id).exec()

  if (queryResult[0] === undefined) {
    await AuthorModel.create({
      pk: 'Author',
      firstPublishedAt: new Date(data._sys.raw.firstPublishedAt).getTime(),
      ...data,
      id,
    })
    return
  }

  const json = queryResult[0].toJSON()
  await AuthorModel.update({ ...json, ...data })
}
