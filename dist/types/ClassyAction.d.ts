import { Action, Dispatch } from 'redux';
export interface ClassyActionStatic<OUT, T extends ClassyAction<OUT | void>> {
    new (...args: any[]): T;
    TYPE: string;
    OnStart: string;
    OnComplete: string;
    OnSuccess: string;
    OnError: string;
}
export interface ClassyAction<OUT = void> extends Action {
    perform: (dispatch: Dispatch, getState: () => any) => Promise<OUT | undefined>;
}
export declare function Classy<OUT = void>(type?: string): ClassyActionStatic<OUT, ClassyAction<OUT>>;
