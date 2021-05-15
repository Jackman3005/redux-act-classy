import { Classy, classyActionsMiddleware } from '../src/redux-act-classy'
import { AnyAction } from 'redux'
import Mock = jest.Mock
import SpyInstance = jest.SpyInstance

interface TestState {
  someReducer: {
    someData: string
  }
}

describe('A Classy Middleware', () => {
  let dispatch: Mock
  let getState: () => TestState
  let next: Mock
  let consoleSpy: SpyInstance
  let middleware: (action: AnyAction) => any
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'info')
    consoleSpy.mockReset()
    dispatch = jest.fn()
    next = jest.fn()
    getState = () => ({ someReducer: { someData: 'E-Z_P-Z' } })
    middleware = classyActionsMiddleware({ dispatch, getState })(next)
    Classy.globalConfig.debugEnabled = false
  })

  describe('when action is plain object', () => {
    it('allows action to pass without modification', () => {
      middleware({ type: 'basic plain object action' })
      expect(next).toHaveBeenCalledWith({ type: 'basic plain object action' })
      expect(next).toHaveBeenCalledTimes(1)
    })

    it('returns result of calling next', () => {
      next.mockReturnValue('next middleware result')
      const result = middleware({ type: 'some-action' })
      expect(result).toEqual('next middleware result')
    })
  })

  describe('when action is a class', () => {
    describe('when it is not a ClassyAction', () => {
      it('ignores it and passes it to next without changing it', () => {
        class SomeOtherLibraryAction {
          type = 'not-a-classy-action'
          some = 'data'
          someFunction() {}
        }

        const action = new SomeOtherLibraryAction()
        middleware(action)

        expect(next).toHaveBeenCalledWith(action)
        expect(next.mock.calls[0][0].someFunction).toBe(action.someFunction)
      })
    })

    describe('when there is no perform function', () => {
      class TestAction extends Classy() {
        someStaticData = '👍 data'

        someFunction() {
          return 'not data'
        }

        someMemberFunction = () => 'not data'

        constructor(readonly someDynamicData: string) {
          super()
        }
      }

      it('copies the data to a plain js object', () => {
        next.mockReturnValue('next middleware result')

        const result = middleware(new TestAction('🚀 data'))

        expect(next).toHaveBeenCalledWith({
          type: TestAction.TYPE,
          someStaticData: '👍 data',
          someDynamicData: '🚀 data'
        })
        expect(next).toHaveBeenCalledTimes(1)
        expect(result).toEqual('next middleware result')
      })

      describe('when debug mode is on', () => {
        it('should log plain js object', async () => {
          const consoleSpy = jest.spyOn(console, 'info')
          Classy.globalConfig.debugEnabled = true

          next.mockReturnValue('next middleware result')

          const result = middleware(new TestAction('🚀 data'))

          expect(next).toHaveBeenCalledWith({
            type: TestAction.TYPE,
            someStaticData: '👍 data',
            someDynamicData: '🚀 data'
          })
          expect(next).toHaveBeenCalledTimes(1)
          expect(result).toEqual('next middleware result')

          expect(consoleSpy).toHaveBeenCalledTimes(1)
          expect(consoleSpy.mock.calls[0][0]).toContain(
            'Dispatching Classy Action'
          )
          expect(consoleSpy.mock.calls[0][1].type).toContain(TestAction.TYPE)
        })
      })
    })

    describe('when perform function is present', () => {
      let mockPerform: Mock
      beforeEach(() => {
        mockPerform = jest.fn()
      })

      class TestAsyncAction extends Classy() {
        perform = async (...args: any[]) => {
          return this.performImpl(...args)
        }

        constructor(
          readonly performImpl: (...args: any[]) => Promise<any>,
          readonly data?: string
        ) {
          super()
        }
      }

      it('does not call next with original action', async () => {
        middleware(new TestAsyncAction(mockPerform))

        expect(next).not.toHaveBeenCalled()
      })

      it('returns promise of perform call', done => {
        dispatch
          .mockReturnValueOnce('dispatch-success')
          .mockReturnValueOnce('dispatch-complete')
        const result = middleware(new TestAsyncAction(mockPerform))

        result.then((response: any) => {
          expect(response).toEqual('dispatch-complete')
          done()
        })
      })

      it('calls perform with dispatcher and getState function', () => {
        middleware(new TestAsyncAction(mockPerform))

        expect(mockPerform).toHaveBeenCalledWith(dispatch, getState)
      })

      it('dispatches OnStart action', () => {
        middleware(new TestAsyncAction(mockPerform, 'some-data'))

        expect(dispatch).toHaveBeenCalledWith({
          type: TestAsyncAction.OnStart,
          actionData: { type: TestAsyncAction.TYPE, data: 'some-data' }
        })
      })

      describe('when perform promise is resolved', () => {
        it('dispatches OnSuccess action', async () => {
          mockPerform.mockReturnValue(
            Promise.resolve({ some: 'success-response' })
          )
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnSuccess,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' },
            successResult: { some: 'success-response' }
          })
        })

        it('dispatches OnComplete action', async () => {
          mockPerform.mockReturnValue(Promise.resolve())
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnComplete,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' }
          })
        })
      })
      describe('when perform promise is rejected', () => {
        it('dispatches OnError action', async () => {
          mockPerform.mockReturnValue(
            Promise.reject({ some: 'error-response' })
          )
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnError,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' },
            errorResult: { some: 'error-response' }
          })
        })

        it('dispatches OnComplete action', async () => {
          mockPerform.mockReturnValue(Promise.reject())
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnComplete,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' }
          })
        })
      })
      describe('when perform function throws an error', () => {
        it('dispatches OnError action', async () => {
          mockPerform.mockImplementation(() => {
            throw 'some error occurred!!'
          })
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnError,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' },
            errorResult: 'some error occurred!!'
          })
        })

        it('dispatches OnComplete action', async () => {
          mockPerform.mockImplementation(() => {
            throw 'some error occurred!!'
          })
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnComplete,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' }
          })
        })
      })

      describe('when debug mode is on', () => {
        it('should log lifecycle actions', async () => {
          Classy.globalConfig.debugEnabled = true

          mockPerform.mockReturnValue(
            Promise.resolve({ some: 'success-response' })
          )
          await middleware(new TestAsyncAction(mockPerform, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnSuccess,
            actionData: { type: TestAsyncAction.TYPE, data: 'some-data' },
            successResult: { some: 'success-response' }
          })

          expect(consoleSpy).toHaveBeenCalledTimes(3)
          expect(consoleSpy.mock.calls[0][0]).toContain(
            'Dispatching Classy ASync Lifecycle Action'
          )
          expect(consoleSpy.mock.calls[0][1].type).toEqual(
            TestAsyncAction.OnStart
          )
          expect(consoleSpy.mock.calls[1][1].type).toEqual(
            TestAsyncAction.OnSuccess
          )
          expect(consoleSpy.mock.calls[2][1].type).toEqual(
            TestAsyncAction.OnComplete
          )
        })
      })
    })
  })
})
