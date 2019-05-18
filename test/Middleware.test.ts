import { EasyActionMiddlewareConfig } from '../src/Middleware'
import { EasyAction, easyActionsMiddleware } from '../src/redux-easy-actions'
import { AnyAction } from 'redux'
import Mock = jest.Mock

interface TestState {
  someReducer: {
    someData: string
  }
}

describe('Easy Actions Middleware', () => {
  let dispatch: Mock
  let getState: () => TestState
  let next: Mock

  beforeEach(() => {
    dispatch = jest.fn()
    next = jest.fn()
    getState = () => ({ someReducer: { someData: 'E-Z_P-Z' } })
  })

  const buildMiddleware = (config?: Partial<EasyActionMiddlewareConfig>) => {
    return easyActionsMiddleware(config)({ dispatch, getState })(next)
  }

  describe('when action is plain object', () => {
    it('allows action to pass without modification', () => {
      buildMiddleware()({ type: 'basic plain object action' })
      expect(next).toHaveBeenCalledWith({ type: 'basic plain object action' })
      expect(next).toHaveBeenCalledTimes(1)
    })

    it('returns result of calling next', () => {
      next.mockReturnValue('next middleware result')
      const result = buildMiddleware()({ type: 'some-action' })
      expect(result).toEqual('next middleware result')
    })
  })

  describe('when action is a class', () => {
    it('copies the data to a plain js object', () => {
      class TestAction extends EasyAction() {
        someStaticData = '👍 data'

        someFunction() {
          return 'not data'
        }

        someMemberFunction = () => 'not data'

        constructor(readonly someDynamicData: string) {
          super()
        }
      }

      next.mockReturnValue('next middleware result')

      const result = buildMiddleware()(new TestAction('🚀 data'))

      expect(next).toHaveBeenCalledWith({
        type: TestAction.TYPE,
        someStaticData: '👍 data',
        someDynamicData: '🚀 data'
      })
      expect(next).toHaveBeenCalledTimes(1)
      expect(result).toEqual('next middleware result')
    })
    describe('when perform function is present', () => {
      let mockPerform: Mock
      beforeEach(() => {
        mockPerform = jest.fn()
      })

      class TestAsyncAction extends EasyAction() {
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
        buildMiddleware()(new TestAsyncAction(mockPerform))

        expect(next).not.toHaveBeenCalled()
      })

      it('returns promise of perform call', done => {
        dispatch
          .mockReturnValueOnce('dispatch-success')
          .mockReturnValueOnce('dispatch-complete')
        const result = buildMiddleware()(new TestAsyncAction(mockPerform))

        result.then((response: any) => {
          expect(response).toEqual('dispatch-complete')
          done()
        })
      })

      it('calls perform with dispatcher and getState function', () => {
        buildMiddleware()(new TestAsyncAction(mockPerform))

        expect(mockPerform).toHaveBeenCalledWith(dispatch, getState)
      })

      describe('when dispatching lifecycle actions', () => {
        let middleware: (action: AnyAction) => AnyAction
        beforeEach(() => {
          middleware = buildMiddleware({
            dispatchLifecycleActions: true
          })
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
      })

      describe('when not dispatching lifecycle actions', () => {
        let middleware: (action: AnyAction) => AnyAction
        beforeEach(() => {
          middleware = buildMiddleware({
            dispatchLifecycleActions: false
          })
        })

        it('should not dispatch anything before or after Promise resolve', async () => {
          mockPerform.mockReturnValue(Promise.resolve())
          const promise = middleware(new TestAsyncAction(mockPerform))

          expect(dispatch).not.toHaveBeenCalled()
          await promise
          expect(dispatch).not.toHaveBeenCalled()
        })

        it('should not dispatch anything before or after Promise reject', async () => {
          mockPerform.mockReturnValue(Promise.reject())
          const promise = middleware(new TestAsyncAction(mockPerform))

          expect(dispatch).not.toHaveBeenCalled()
          await promise
          expect(dispatch).not.toHaveBeenCalled()
        })
      })
    })
  })
})
