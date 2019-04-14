import { Action, Dispatch } from 'redux';
export interface EasyActionStatic<OUT, T extends EasyAction<OUT | void>> {
    new (...args: any[]): T;
    TYPE: string;
    OnStart: string;
    OnComplete: string;
    OnSuccess: string;
    OnError: string;
}
export interface EasyAction<OUT = void> extends Action {
    doAsync: (dispatch: Dispatch, getState: () => any) => Promise<OUT | undefined>;
}
export declare function EasyAction<OUT = void>(type?: string): EasyActionStatic<OUT, EasyAction<OUT>>;
