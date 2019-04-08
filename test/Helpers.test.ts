import { EasyAction } from '../src/redux-easy-actions'
import {
  afterComplete,
  afterError,
  afterSuccess,
  beforeStart,
  isAction
} from '../src/Helpers'

describe('redux easy action helper functions', () => {
  class TestAction extends EasyAction('test-type') {
    constructor(readonly myData: string) {
      super()
    }
  }

  test('isAction check if types match', () => {
    expect(isAction({ type: 'test-type' }, TestAction)).toBe(true)
    expect(isAction({ type: 'another-type' }, TestAction)).toBe(false)
  })

  test('beforeStart check if types match', () => {
    expect(beforeStart({ type: 'test-type-start' }, TestAction)).toBe(true)
    expect(beforeStart({ type: 'test-type' }, TestAction)).toBe(false)
    expect(beforeStart({ type: 'another-type-start' }, TestAction)).toBe(false)
  })

  test('afterSuccess check if types match', () => {
    expect(afterSuccess({ type: 'test-type-success' }, TestAction)).toBe(true)
    expect(afterSuccess({ type: 'test-type' }, TestAction)).toBe(false)
    expect(afterSuccess({ type: 'another-type-success' }, TestAction)).toBe(
      false
    )
  })

  test('afterError check if types match', () => {
    expect(afterError({ type: 'test-type-error' }, TestAction)).toBe(true)
    expect(afterError({ type: 'test-type' }, TestAction)).toBe(false)
    expect(afterError({ type: 'another-type-error' }, TestAction)).toBe(false)
  })

  test('afterComplete check if types match', () => {
    expect(afterComplete({ type: 'test-type-complete' }, TestAction)).toBe(true)
    expect(afterComplete({ type: 'test-type' }, TestAction)).toBe(false)
    expect(afterComplete({ type: 'another-type-complete' }, TestAction)).toBe(
      false
    )
  })

  describe('when action types match', () => {})
})
