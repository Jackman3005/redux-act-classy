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
