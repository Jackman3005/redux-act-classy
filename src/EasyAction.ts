import { Action, Dispatch } from 'redux'

export interface EasyActionStatic<OUT, T extends EasyAction<OUT | void>> {
  new (...args: any[]): T

  TYPE: string
  OnStart: string
  OnComplete: string
  OnSuccess: string
  OnError: string
}

export interface EasyAction<OUT = void> extends Action {
  perform: (dispatch: Dispatch, getState: () => any) => Promise<OUT | undefined>
}

const typesInUse: string[] = []
export function EasyAction<OUT = void>(
  type?: string
): EasyActionStatic<OUT, EasyAction<OUT>> {
  if (!type) {
    type = 'EasyAction-' + typesInUse.length
  }

  if (typesInUse.includes(type)) {
    console.warn(
      "WARNING - this type: '" +
        type +
        "' has already been used for another action! " +
        'This will likely cause unexpected behavior. Please choose a new unique action type.'
    )
  }
  typesInUse.push(type)

  class ActionImpl implements Action {
    public static OnStart = `${type}-start`
    public static OnComplete = `${type}-complete`
    public static OnSuccess = `${type}-success`
    public static OnError = `${type}-error`

    public static TYPE = type
    public readonly type = type
  }

  return ActionImpl as EasyActionStatic<OUT, EasyAction<OUT>>
}
