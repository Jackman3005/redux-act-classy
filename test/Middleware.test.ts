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
      class TestAction extends EasyAction('class-action') {
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
        type: 'class-action',
        someStaticData: '👍 data',
        someDynamicData: '🚀 data'
      })
      expect(next).toHaveBeenCalledTimes(1)
      expect(result).toEqual('next middleware result')
    })
    describe('when doAsync function is present', () => {
      let mockDoAsync: Mock
      beforeEach(() => {
        mockDoAsync = jest.fn()
      })

      class TestAsyncAction extends EasyAction('class-action') {
        doAsync = async (...args: any[]) => {
          return this.doAsyncImpl(...args)
        }

        constructor(
          readonly doAsyncImpl: (...args: any[]) => Promise<any>,
          readonly data?: string
        ) {
          super()
        }
      }

      it('does not call next with original action', async () => {
        buildMiddleware()(new TestAsyncAction(mockDoAsync))

        expect(next).not.toHaveBeenCalled()
      })

      it('returns promise of doAsync call', done => {
        dispatch
          .mockReturnValueOnce('dispatch-success')
          .mockReturnValueOnce('dispatch-complete')
        const result = buildMiddleware()(new TestAsyncAction(mockDoAsync))

        result.then((response: any) => {
          expect(response).toEqual('dispatch-complete')
          done()
        })
      })

      it('calls doAsync with dispatcher and getState function', () => {
        buildMiddleware()(new TestAsyncAction(mockDoAsync))

        expect(mockDoAsync).toHaveBeenCalledWith(dispatch, getState)
      })

      describe('when dispatching lifecycle actions', () => {
        let middleware: (action: AnyAction) => AnyAction
        beforeEach(() => {
          middleware = buildMiddleware({
            dispatchLifecycleActions: true
          })
        })

        it('dispatches OnStart action', () => {
          middleware(new TestAsyncAction(mockDoAsync, 'some-data'))

          expect(dispatch).toHaveBeenCalledWith({
            type: TestAsyncAction.OnStart,
            actionData: { type: 'class-action', data: 'some-data' }
          })
        })
        describe('when doAsync promise is resolved', () => {
          it('dispatches OnSuccess action', async () => {
            mockDoAsync.mockReturnValue(
              Promise.resolve({ some: 'success-response' })
            )
            await middleware(new TestAsyncAction(mockDoAsync, 'some-data'))

            expect(dispatch).toHaveBeenCalledWith({
              type: TestAsyncAction.OnSuccess,
              actionData: { type: 'class-action', data: 'some-data' },
              successResult: { some: 'success-response' }
            })
          })

          it('dispatches OnComplete action', async () => {
            mockDoAsync.mockReturnValue(Promise.resolve())
            await middleware(new TestAsyncAction(mockDoAsync, 'some-data'))

            expect(dispatch).toHaveBeenCalledWith({
              type: TestAsyncAction.OnComplete,
              actionData: { type: 'class-action', data: 'some-data' }
            })
          })
        })
        describe('when doAsync promise is rejected', () => {
          it('dispatches OnError action', async () => {
            mockDoAsync.mockReturnValue(
              Promise.reject({ some: 'error-response' })
            )
            await middleware(new TestAsyncAction(mockDoAsync, 'some-data'))

            expect(dispatch).toHaveBeenCalledWith({
              type: TestAsyncAction.OnError,
              actionData: { type: 'class-action', data: 'some-data' },
              errorResult: { some: 'error-response' }
            })
          })

          it('dispatches OnComplete action', async () => {
            mockDoAsync.mockReturnValue(Promise.reject())
            await middleware(new TestAsyncAction(mockDoAsync, 'some-data'))

            expect(dispatch).toHaveBeenCalledWith({
              type: TestAsyncAction.OnComplete,
              actionData: { type: 'class-action', data: 'some-data' }
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
          mockDoAsync.mockReturnValue(Promise.resolve())
          const promise = middleware(new TestAsyncAction(mockDoAsync))

          expect(dispatch).not.toHaveBeenCalled()
          await promise
          expect(dispatch).not.toHaveBeenCalled()
        })

        it('should not dispatch anything before or after Promise reject', async () => {
          mockDoAsync.mockReturnValue(Promise.reject())
          const promise = middleware(new TestAsyncAction(mockDoAsync))

          expect(dispatch).not.toHaveBeenCalled()
          await promise
          expect(dispatch).not.toHaveBeenCalled()
        })
      })
    })
  })
})
