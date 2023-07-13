import {
  HTTP_ERROR_CODES,
  HTTP_SUCCESS_CODES,
} from '~/server/modules/constants'
import { CommonError } from '~/server/modules/error/CommonError'
import { execute } from '~/server/services/ArticleService'
import { checkNewtExecutor } from '~/server/services/AuthorizationService'
import { Article } from '~/composables/repositories/articleRepository'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data: Article = body.data
  const isDelete: boolean = body.is_delete
  const authorization = getHeader(event, 'Authorization')

  try {
    checkNewtExecutor(authorization)
    await execute(data, isDelete)
    setResponseStatus(event, HTTP_SUCCESS_CODES.NO_CONTENT)
    return {}
  } catch (error) {
    console.error(error)
    if (error instanceof CommonError) {
      throw createError({
        statusCode: error.statusCode,
        message: error.message || 'Article execute failed.',
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
