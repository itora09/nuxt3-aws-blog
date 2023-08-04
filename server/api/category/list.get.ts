import {
  HTTP_ERROR_CODES,
  HTTP_SUCCESS_CODES,
} from '~/server/modules/constants'
import { CommonError } from '~/server/modules/error/CommonError'
import { ValidationZodError } from '~/server/modules/error/ValidationZodError'
import { getCategoryList } from '~/server/services/CategoryService'

export default defineEventHandler(async (event) => {
  try {
    const categoryList = await getCategoryList()
    setResponseStatus(event, HTTP_SUCCESS_CODES.OK)
    return categoryList
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
