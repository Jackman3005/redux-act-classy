import {Action, Dispatch} from 'redux'

export interface EasyActionStatic<OUT, T extends EasyAction<OUT | void>> {
    new(...args: any[]): T;

    TYPE: string;
    OnStart: string;
    OnComplete: string;
    OnSuccess: string;
    OnError: string;
}

export interface EasyAction<OUT = void> extends Action {
    doAsync: (dispatch: Dispatch, getState: () => any) => Promise<OUT | undefined>;
}

export function EasyAction<OUT = void>(type: string): EasyActionStatic<OUT, EasyAction<OUT>> {
    class _Action implements Action {
        public static OnStart = `${type}-start`
        public static OnComplete = `${type}-complete`
        public static OnSuccess = `${type}-success`
        public static OnError = `${type}-error`

        public static TYPE = type
        public readonly type = type
    }

    return _Action as EasyActionStatic<OUT, EasyAction<OUT>>
}

// Could add a reducer that stores all OnStart, etc states for each Action. state.asyncActions[MyAction.TYPE].status
// multiple async actions of the same type (potentially with different data) may be going at the same time

// test that functions are not passed when deconstructing {...action}

// Bug: Fix doAsync return types that are arrays. only able to determine they are any[] atm