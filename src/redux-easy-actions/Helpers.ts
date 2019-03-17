import {Action, AnyAction} from 'redux'
import {EasyAction, AsyncActionStatic} from './AsyncAction'

type DoAsyncResult<T, U = AsyncActionWithInferredResult<T>> = {
    [k in keyof U]: U[k]
}
type AsyncActionWithInferredResult<T> = T extends { doAsync: (...args: any[]) => Promise<infer U> } ? NonNullable<U> : never;


type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type DataPropertiesOnly<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface StartAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
}

interface SuccessAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
    successResult: OUT;
}

interface ErrorAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
    errorResult: any;
}

interface CompleteAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
}


export function isAction<T extends EasyAction<OUT | void>,
    U extends AsyncActionStatic<OUT, T>,
    OUT extends DoAsyncResult<T>>
(action: AnyAction, actionClass: (new (...args: any[]) => T) & U)
    : action is DataPropertiesOnly<T> & Action {
    return action.type === actionClass.TYPE
}

export function beforeStart<T extends EasyAction<OUT | void>,
    U extends AsyncActionStatic<OUT, T>,
    OUT extends DoAsyncResult<T>>
(action: AnyAction, actionClass: (new (...args: any[]) => T) & U)
    : action is StartAction<T, OUT> {
    return action.type === actionClass.OnStart
}

export function afterSuccess<T extends EasyAction<OUT | void>,
    U extends AsyncActionStatic<OUT, T>,
    OUT extends DoAsyncResult<T>>
(action: AnyAction, actionClass: (new (...args: any[]) => T) & U)
    : action is SuccessAction<T, OUT> {
    return action.type === actionClass.OnSuccess
}

export function afterError<T extends EasyAction<OUT | void>,
    U extends AsyncActionStatic<OUT, T>,
    OUT extends DoAsyncResult<T>>
(action: AnyAction, actionClass: (new (...args: any[]) => T) & U)
    : action is ErrorAction<T, OUT> {
    return action.type === actionClass.OnError
}

export function afterComplete<T extends EasyAction<OUT | void>,
    U extends AsyncActionStatic<OUT, T>,
    OUT extends DoAsyncResult<T>>
(action: AnyAction, actionClass: (new (...args: any[]) => T) & U)
    : action is CompleteAction<T, OUT> {
    return action.type === actionClass.OnComplete
}
