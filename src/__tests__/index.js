import order from '../index'

const getContext = (request = {}, state = {}) => ({
  request: {
    method: 'GET',
    query: {},
    ...request,
  },
  state,
})
const next = jest.fn()
const middleware = order({ stateParam: 'order' })

beforeEach(() => {
  next.mockClear()
})

test('order middleware is defined', () => {
  expect(order).toBeDefined()
  expect(typeof order).toBe('function')
  expect(middleware).toBeDefined()
  expect(typeof middleware).toBe('function')
})

test("ignores sort property if it's not a GET request", () => {
  const context = getContext({ method: 'POST' })
  middleware(context, next)

  expect(context.state).toEqual({})
  expect(next).toBeCalledTimes(1)
})

test('ignores empty sort', () => {
  const context = getContext()
  middleware(context, next)

  expect(context.state).toEqual({})
})

test('sets single "created_at desc"', () => {
  const context = getContext({ query: { sort: 'created_at' } })
  middleware(context, next)

  expect(context.state).toMatchSnapshot()
})

test('sets single "created_at asc"', () => {
  const context = getContext({ query: { sort: '-created_at' } })
  middleware(context, next)

  expect(context.state).toMatchSnapshot()
})

test('sets multiple order params', () => {
  const context = getContext({ query: { sort: 'active,-created_at' } })
  middleware(context, next)

  expect(context.state).toMatchSnapshot()
})

test('returns state.order property as object', () => {
  const middlewareWithOptions = order({ asObject: true, stateParam: 'order' })
  const context = getContext({
    query: { sort: 'active,-created_at' },
  })

  middlewareWithOptions(context, next)

  expect(context.state).toMatchSnapshot()
})

test('reads from custom query param and sets it to custom state param', () => {
  const middlewareWithOptions = order({ param: 'order', stateParam: 'custom' })
  const context = getContext({
    query: { order: 'active,-created_at' },
  })

  middlewareWithOptions(context, next)

  expect(context.state).toMatchSnapshot()
})
