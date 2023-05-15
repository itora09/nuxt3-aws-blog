import { AuthorizationError } from '../modules/error/AuthorizationError'

/**
 * newtから実行されている処理かチェックする
 * @param authorization ヘッダーのAuthorizationに設定している値
 */
export const checkNewtExecutor = (authorization: string | undefined) => {
  if (authorization === undefined)
    throw new AuthorizationError('Authorization could not be obtained.')
  if (!authorization.startsWith('Bearer '))
    throw new AuthorizationError('Tokens must begin with Bearer.')
  const token = authorization.replace('Bearer ', '')
  if (token !== process.env.WEBHOOK_TOKEN)
    throw new AuthorizationError('Incorrect token information.')
}
