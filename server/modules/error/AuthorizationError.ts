import { HTTP_ERROR_CODES } from '../constants'
import { CommonError } from './CommonError'

export class AuthorizationError extends CommonError {
  constructor(message?: string) {
    super(HTTP_ERROR_CODES.UNAUTHORIZED, message)
  }
}
