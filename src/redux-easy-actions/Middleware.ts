import {Middleware} from 'redux'
import _ from 'lodash'

export const easyActionsMiddleware: Middleware = ({dispatch, getState}) => (next) => (action) => {
    const actionIsAClass = action.constructor
    if (actionIsAClass) {
        const actionAsObject = extractNonFunctionFields(action)

        const isAsynchronousAction = !!action.doAsync
        if (isAsynchronousAction) {
            dispatch({
                actionData: actionAsObject,
                type: action.constructor.OnStart,
            })
            action.doAsync(dispatch, getState)
                .then((successResult: any) => dispatch({
                    actionData: actionAsObject,
                    type: action.constructor.OnSuccess,
                    successResult,
                }))
                .catch((errorResult: any) => dispatch({
                    actionData: actionAsObject,
                    type: action.constructor.OnError,
                    errorResult,
                }))
                .finally(() => dispatch({
                    actionData: actionAsObject,
                    type: action.constructor.OnComplete,
                }))
        } else {
            next({...actionAsObject})
        }
    } else {
        next(action)
    }
}

const extractNonFunctionFields = (obj: any) => {
    const cleanedObj: any = {}
    Object.keys(obj)
        .filter((key) => !_.isFunction(obj[key]))
        .forEach((key) => {
            cleanedObj[key] = obj[key]
        })
    return cleanedObj
}