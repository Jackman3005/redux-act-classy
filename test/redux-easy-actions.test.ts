import * as easyActions from '../src/redux-easy-actions'

describe('redux-easy-actions', () => {
  it('exports library features', () => {
    expect(easyActions).toBeDefined()

    expect(easyActions.EasyAction).toBeDefined()
    expect(easyActions.easyActionsMiddleware).toBeDefined()
  })
})
