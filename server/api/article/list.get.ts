import { HTTP_ERROR_CODES } from '~/server/modules/constants'
import { CommonError } from '~/server/modules/error/CommonError'
import { ValidationZodError } from '~/server/modules/error/ValidationZodError'
import {
  validationListApi,
  getArticleList,
} from '~/server/services/ArticleService'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  try {
    const resultQuery = validationListApi(query)
    const articleList = await getArticleList(resultQuery)
    setResponseStatus(event, 200)
    return articleList
  } catch (error) {
    console.error(error)
    if (error instanceof ValidationZodError || error instanceof CommonError) {
      throw createError({
        statusCode: error.statusCode,
        message: error.message || 'Failed to retrieve article.',
        stack: '',
      })
    }
    throw createError({
      statusCode: HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'An unexpected exception occurred.',
      stack: '',
    })
  }
})
