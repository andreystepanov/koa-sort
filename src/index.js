// @flow
import { type Context } from 'koa'
import debug from 'debug'

const logger = debug('koa:sort')

export default function sort(options?: Object) {
  const defaults = {
    param: 'sort',
    asObject: false,
    ...options,
  }

  return async function sortMiddleware(ctx: Context, next: () => Promise<*>) {
    const { query, method } = ctx.request
    const { asObject, param: paramName, stateParam } = defaults
    const param = query[paramName]

    if (method === 'GET' && param && typeof param === 'string') {
      const params = param.split(',')
      const sortObj = {}

      const sortArr = params.map(sortField => {
        const asc = sortField.charAt(0) === '-'
        const field = asc ? sortField.substring(1) : sortField
        const direction = asc ? 'asc' : 'desc'

        sortObj[field] = direction

        return [field, direction]
      })

      if (sortArr.length > 0) {
        const key = stateParam || paramName
        const value = asObject === true ? sortObj : sortArr

        ctx.state[key] = value

        logger('%s: %O', `ctx.state.${key}`, value)
      }
    }

    return next()
  }
}
