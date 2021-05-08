import { Action, AnyAction } from 'redux'
import { ClassyAction, ClassyActionStatic } from './ClassyAction'

type PerformResult<T, U = AsyncActionWithInferredResult<T>> = {
  [k in keyof U]: U[k]
}
type AsyncActionWithInferredResult<T> = T extends {
  perform: (...args: any[]) => Promise<infer U>
}
  ? NonNullable<U>
  : never

type NonFunctionPropertyNames<OBJECT> = {
  [FIELD in keyof OBJECT]: OBJECT[FIELD] extends Function ? never : FIELD
}[keyof OBJECT]
type DataPropertiesOnly<T> = Pick<T, NonFunctionPropertyNames<T>>

export interface StartAction<T extends ClassyAction<OUT | unknown>, OUT> {
  type: string
  actionData: DataPropertiesOnly<T>
}

export interface SuccessAction<T extends ClassyAction<OUT | unknown>, OUT> {
  type: string
  actionData: DataPropertiesOnly<T>
  successResult: OUT
}

export interface ErrorAction<T extends ClassyAction<OUT | unknown>, OUT> {
  type: string
  actionData: DataPropertiesOnly<T>
  errorResult: any
}

export interface CompleteAction<T extends ClassyAction<OUT | unknown>, OUT> {
  type: string
  actionData: DataPropertiesOnly<T>
}

export function isAction<
  T extends ClassyAction<OUT | unknown>,
  U extends ClassyActionStatic<OUT, T>,
  OUT extends PerformResult<T>
>(
  action: AnyAction,
  actionClass: (new (...args: any[]) => T) & U
): action is DataPropertiesOnly<T> & Action {
  return action.type === actionClass.TYPE
}

export function beforeStart<
  T extends ClassyAction<OUT | unknown>,
  U extends ClassyActionStatic<OUT, T>,
  OUT extends PerformResult<T>
>(
  action: AnyAction,
  actionClass: (new (...args: any[]) => T) & U
): action is StartAction<T, OUT> {
  return action.type === actionClass.OnStart
}

export function afterSuccess<
  T extends ClassyAction<OUT | unknown>,
  U extends ClassyActionStatic<OUT, T>,
  OUT extends PerformResult<T>
>(
  action: AnyAction,
  actionClass: (new (...args: any[]) => T) & U
): action is SuccessAction<T, OUT> {
  return action.type === actionClass.OnSuccess
}

export function afterError<
  T extends ClassyAction<OUT | unknown>,
  U extends ClassyActionStatic<OUT, T>,
  OUT extends PerformResult<T>
>(
  action: AnyAction,
  actionClass: (new (...args: any[]) => T) & U
): action is ErrorAction<T, OUT> {
  return action.type === actionClass.OnError
}

export function afterComplete<
  T extends ClassyAction<OUT | unknown>,
  U extends ClassyActionStatic<OUT, T>,
  OUT extends PerformResult<T>
>(
  action: AnyAction,
  actionClass: (new (...args: any[]) => T) & U
): action is CompleteAction<T, OUT> {
  return action.type === actionClass.OnComplete
}
