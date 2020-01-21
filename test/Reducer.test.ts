import { Classy } from '../src/redux-act-classy'
import reducer, { ActionInfoState } from '../src/Reducer'
import { Action, AnyAction } from 'redux'

class TestAction extends Classy() {}
class AnotherTestAction extends Classy() {}

describe('redux-act-classy reducer', () => {
  let initialState: ActionInfoState
  let startOfTestAction: AnyAction
  let endOfTestAction: AnyAction

  beforeEach(() => {
    initialState = { anyPending: false, pendingActionsCount: 0, actions: {} }
    startOfTestAction = {
      actionData: { type: TestAction.TYPE },
      type: TestAction.OnStart
    }
    endOfTestAction = { type: TestAction.OnComplete }
  })

  it('returns anyPending as false by default', () => {
    const state = reducer((undefined as any) as ActionInfoState, {} as Action)

    expect(state.anyPending).toBe(false)
  })

  describe('when a single action is pending', () => {
    it('sets anyPending to true', () => {
      const newState = reducer(initialState, startOfTestAction)

      expect(newState.anyPending).toBe(true)
    })

    describe('when that action is completed', () => {
      it('sets anyPending back to false', () => {
        const firstState = reducer(initialState, startOfTestAction)
        const secondState = reducer(firstState, endOfTestAction)

        expect(secondState.anyPending).toBe(false)
      })
    })
  })

  describe('when two actions are pending', () => {
    it('returns anyPending while one is still pending', () => {
      const firstState = reducer(initialState, startOfTestAction)
      const secondState = reducer(firstState, startOfTestAction)
      const { anyPending } = reducer(secondState, endOfTestAction)

      expect(anyPending).toBe(true)
    })

    describe('when two different actions are dispatched', () => {
      let startOfAnotherTestAction: Action
      let endOfAnotherTestAction: Action

      beforeEach(() => {
        initialState = {
          anyPending: false,
          pendingActionsCount: 0,
          actions: {}
        }
        startOfAnotherTestAction = { type: AnotherTestAction.OnStart }
        endOfAnotherTestAction = { type: AnotherTestAction.OnComplete }
      })

      it('only marks one action as pending', () => {
        const firstState = reducer(initialState, startOfTestAction)

        expect(firstState.actions[TestAction.TYPE].anyPending).toBe(true)
        expect(firstState.actions[AnotherTestAction.TYPE].anyPending).toBe(
          false
        )
      })
    })
  })
})
