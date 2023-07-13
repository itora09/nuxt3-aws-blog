import { CategoryModel } from '../models/dynamoDB/Category'
import { Category } from '~/composables/repositories/categoryRepository'

export const execute = async (data: Category, isDelete: boolean) => {
  isDelete ? await categoryDelete(data) : await categoryUpsert(data)
}

/**
 * カテゴリを削除する
 * カテゴリが無かった場合は何もせずに正常終了とする
 * @param data カテゴリ情報
 */
const categoryDelete = async (data: Category) => {
  await CategoryModel.delete({
    pk: 'Category',
    firstPublishedAt: new Date(data._sys.raw.firstPublishedAt).getTime(),
  })
}

/**
 * カテゴリを作成または更新する
 * @param data カテゴリ情報
 */
const categoryUpsert = async (data: Category) => {
  const id = `Category_${data._id}`
  const queryResult = await CategoryModel.query('id').eq(id).exec()

  if (queryResult[0] === undefined) {
    await CategoryModel.create({
      pk: 'Category',
      firstPublishedAt: new Date(data._sys.raw.firstPublishedAt).getTime(),
      ...data,
      id,
    })
    return
  }

  const json = queryResult[0].toJSON()
  await CategoryModel.update({ ...json, ...data })
}
