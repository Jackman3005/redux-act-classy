import { Action, AnyAction } from 'redux';
import { EasyAction, EasyActionStatic } from './EasyAction';
declare type DoAsyncResult<T, U = AsyncActionWithInferredResult<T>> = {
    [k in keyof U]: U[k];
};
declare type AsyncActionWithInferredResult<T> = T extends {
    doAsync: (...args: any[]) => Promise<infer U>;
} ? NonNullable<U> : never;
declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
declare type DataPropertiesOnly<T> = Pick<T, NonFunctionPropertyNames<T>>;
export interface StartAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
}
export interface SuccessAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
    successResult: OUT;
}
export interface ErrorAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
    errorResult: any;
}
export interface CompleteAction<T extends EasyAction<OUT | void>, OUT> {
    type: string;
    actionData: DataPropertiesOnly<T>;
}
export declare function isAction<T extends EasyAction<OUT | void>, U extends EasyActionStatic<OUT, T>, OUT extends DoAsyncResult<T>>(action: AnyAction, actionClass: (new (...args: any[]) => T) & U): action is DataPropertiesOnly<T> & Action;
export declare function beforeStart<T extends EasyAction<OUT | void>, U extends EasyActionStatic<OUT, T>, OUT extends DoAsyncResult<T>>(action: AnyAction, actionClass: (new (...args: any[]) => T) & U): action is StartAction<T, OUT>;
export declare function afterSuccess<T extends EasyAction<OUT | void>, U extends EasyActionStatic<OUT, T>, OUT extends DoAsyncResult<T>>(action: AnyAction, actionClass: (new (...args: any[]) => T) & U): action is SuccessAction<T, OUT>;
export declare function afterError<T extends EasyAction<OUT | void>, U extends EasyActionStatic<OUT, T>, OUT extends DoAsyncResult<T>>(action: AnyAction, actionClass: (new (...args: any[]) => T) & U): action is ErrorAction<T, OUT>;
export declare function afterComplete<T extends EasyAction<OUT | void>, U extends EasyActionStatic<OUT, T>, OUT extends DoAsyncResult<T>>(action: AnyAction, actionClass: (new (...args: any[]) => T) & U): action is CompleteAction<T, OUT>;
export {};
