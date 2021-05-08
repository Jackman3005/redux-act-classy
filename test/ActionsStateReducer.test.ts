import { reducer, ActionsState } from '../src/ActionsStateReducer'
import { Classy } from '../src/ClassyAction'
import { AnyAction } from 'redux'

describe('ActionsStateReducer', () => {
  let oldState: ActionsState
  beforeEach(() => {
    oldState = {
      inProgress: {}
    }
  })

  class TestAction extends Classy() {}

  it('initializes state to empty', () => {
    const newState = reducer(
      (undefined as unknown) as ActionsState,
      ({} as unknown) as AnyAction
    )

    expect(newState).toEqual({
      inProgress: {}
    })
  })

  it('returns state untouched if unknown action is received', () => {
    const newState = reducer(oldState, { type: 'something-unknown' })

    expect(newState).toBe(oldState)
  })

  describe('inProgress', () => {
    it('makes inProgress truthy when receiving OnStart lifecycle action', () => {
      const newState = reducer(oldState, { type: TestAction.OnStart })

      expect(newState.inProgress[TestAction.TYPE]).toBeTruthy()
    })

    it('should have inProgress as falsy if no action has been received before', () => {
      const newState = reducer(oldState, { type: 'AnotherAction-start' })

      expect(newState.inProgress[TestAction.TYPE]).toBeFalsy()
    })

    it('should have inProgress as falsy if no action has been received before', () => {
      const newState = reducer(oldState, { type: 'AnotherAction-start' })

      expect(newState.inProgress[TestAction.TYPE]).toBeFalsy()
    })

    it('set inProgress back to falsy after receiving an OnComplete action', () => {
      const inProgressState = reducer(oldState, { type: TestAction.OnStart })
      const newState = reducer(inProgressState, { type: TestAction.OnComplete })

      expect(newState.inProgress[TestAction.TYPE]).toBeFalsy()
    })

    describe('multiple events in progress at the same time', () => {
      it('keeps inProgress truthy if the number of OnStart actions is greater than the number of OnComplete actions', () => {
        const inProgressState = reducer(oldState, { type: TestAction.OnStart })
        const inProgressState2 = reducer(inProgressState, {
          type: TestAction.OnStart
        })
        const newState = reducer(inProgressState2, {
          type: TestAction.OnComplete
        })

        expect(newState.inProgress[TestAction.TYPE]).toBeTruthy()
      })

      it('sets inProgress to falsy if the number of OnStart actions equal to the number of OnComplete actions', () => {
        const inProgressState = reducer(oldState, { type: TestAction.OnStart })
        const inProgressState2 = reducer(inProgressState, {
          type: TestAction.OnStart
        })
        const oneCompleteOneInProgress = reducer(inProgressState2, {
          type: TestAction.OnComplete
        })
        const newState = reducer(oneCompleteOneInProgress, {
          type: TestAction.OnComplete
        })

        expect(newState.inProgress[TestAction.TYPE]).toBeFalsy()
      })
    })
  })
})
