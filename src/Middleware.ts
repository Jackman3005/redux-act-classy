import { AnyAction, Middleware, MiddlewareAPI } from 'redux'
import * as _ from 'lodash'
import { Classy, ClassyAction } from './ClassyAction'

export const classyActionsMiddleware: Middleware = dispatchAndGetState => next => action => {
  if (!isAClassyAction(action)) {
    return next(action)
  }

  const actionHasAsyncSideEffect = _.isFunction(action.perform)
  if (actionHasAsyncSideEffect) {
    return handleAsyncAction(action, dispatchAndGetState)
  } else {
    const plainObjectAction = convertToPlainObject(action)
    Classy.globalConfig.debugEnabled &&
      console.info('Dispatching Classy Action: ', plainObjectAction)
    return next(plainObjectAction)
  }
}

function isAClassyAction(action: any) {
  const actionIsAClass = !_.isPlainObject(action)
  return (
    actionIsAClass && action.constructor && action.constructor.IsAClassyAction
  )
}

function handleAsyncAction(
  action: ClassyAction,
  { dispatch, getState }: MiddlewareAPI
) {
  function classyDispatch(a: AnyAction) {
    if (Classy.globalConfig.debugEnabled) {
      console.info('Dispatching Classy ASync Lifecycle Action: ', a)
    }
    return dispatch(a)
  }

  const actionAsObject = convertToPlainObject(action)

  classyDispatch({
    actionData: actionAsObject,
    type: action.constructor.OnStart
  })
  return action
    .perform(dispatch, getState)
    .then((successResult: any) =>
      classyDispatch({
        actionData: actionAsObject,
        type: action.constructor.OnSuccess,
        successResult
      })
    )
    .catch((errorResult: any) =>
      classyDispatch({
        actionData: actionAsObject,
        type: action.constructor.OnError,
        errorResult
      })
    )
    .finally(() =>
      classyDispatch({
        actionData: actionAsObject,
        type: action.constructor.OnComplete
      })
    )
}

function convertToPlainObject(obj: any) {
  const cleanedObj: any = {}
  Object.keys(obj)
    .filter(key => !_.isFunction(obj[key]))
    .forEach(key => {
      cleanedObj[key] = obj[key]
    })
  return cleanedObj
}
