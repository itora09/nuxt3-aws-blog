import { ZodError } from 'zod'
import { HTTP_ERROR_CODES } from '../constants'
import { CommonError } from './CommonError'

export class ValidationZodError extends CommonError {
  constructor(error: ZodError) {
    const errorMessageArray = ['validation check error']
    error.errors.forEach((item) => {
      errorMessageArray.push(
        `path: [${item.path.join('.')}] message:${item.message}`
      )
    })
    super(HTTP_ERROR_CODES.BAD_REQUEST, errorMessageArray.join('\n'))
  }
}
