import {
  HTTP_ERROR_CODES,
  HTTP_SUCCESS_CODES,
} from '~/server/modules/constants'
import { CommonError } from '~/server/modules/error/CommonError'
import { checkNewtExecutor } from '~/server/services/AuthorizationService'
import { execute } from '~/server/services/AuthorService'
import { Author } from '~/composables/repositories/authorRepository'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data: Author = body.data
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
        message: error.message || 'Author execute failed.',
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
