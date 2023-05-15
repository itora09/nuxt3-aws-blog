/* eslint-disable import/no-named-as-default-member */
import { ValueType } from 'dynamoose/dist/Schema'
import moment from 'moment'

export const commonDate = {
  type: String,
  validate: (value: ValueType) =>
    moment(value.toString(), moment.ISO_8601, true).isValid(),
  set: (value: ValueType) => moment(value.toString()).toISOString(),
  get: (value: any) => moment(value).toDate(),
}
