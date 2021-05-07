import { AnyAction, Dispatch, Middleware } from 'redux'
import * as _ from 'lodash'
import { Classy, ClassyAction } from './ClassyAction'

export interface MiddlewareConfig {
  dispatchLifecycleActions: boolean
}

const defaultConfig: MiddlewareConfig = {
  dispatchLifecycleActions: true
}

function handleAsyncAction(
  dispatchLifecycleActions: boolean,
  action: ClassyAction,
  dispatch: Dispatch,
  getState: () => any
) {
  function classyDispatch(a: AnyAction) {
    if (Classy.globalConfig.debugEnabled) {
      console.info('Dispatching Classy ASync Lifecycle Action: ', a)
    }
    return dispatch(a)
  }

  const actionAsObject = convertToPlainObject(action)

  if (dispatchLifecycleActions) {
    classyDispatch({
      actionData: actionAsObject,
      type: action.constructor.OnStart
    })
  }
  return action
    .perform(dispatch, getState)
    .then(
      (successResult: any) =>
        dispatchLifecycleActions &&
        classyDispatch({
          actionData: actionAsObject,
          type: action.constructor.OnSuccess,
          successResult
        })
    )
    .catch(
      (errorResult: any) =>
        dispatchLifecycleActions &&
        classyDispatch({
          actionData: actionAsObject,
          type: action.constructor.OnError,
          errorResult
        })
    )
    .finally(
      () =>
        dispatchLifecycleActions &&
        classyDispatch({
          actionData: actionAsObject,
          type: action.constructor.OnComplete
        })
    )
}

export const buildAClassyMiddleware = (
  config?: Partial<MiddlewareConfig>
): Middleware => ({ dispatch, getState }) => next => action => {
  const { dispatchLifecycleActions } = Object.assign(defaultConfig, config)

  const actionIsAClass = !_.isPlainObject(action)
  if (actionIsAClass) {
    const actionHasSideEffect = _.isFunction(action.perform)
    if (actionHasSideEffect) {
      return handleAsyncAction(
        dispatchLifecycleActions,
        action,
        dispatch,
        getState
      )
    } else {
      const plainObjectAction = convertToPlainObject(action)
      if (Classy.globalConfig.debugEnabled) {
        console.info('Dispatching Classy Action: ', plainObjectAction)
      }
      return next(plainObjectAction)
    }
  } else {
    return next(action)
  }
}

const convertToPlainObject = (obj: any) => {
  const cleanedObj: any = {}
  Object.keys(obj)
    .filter(key => !_.isFunction(obj[key]))
    .forEach(key => {
      cleanedObj[key] = obj[key]
    })
  return cleanedObj
}
