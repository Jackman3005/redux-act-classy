import { Middleware } from 'redux';
export interface EasyActionMiddlewareConfig {
    dispatchLifecycleActions: boolean;
}
export declare const easyActionsMiddleware: (config?: Partial<EasyActionMiddlewareConfig> | undefined) => Middleware<{}, any, import("redux").Dispatch<import("redux").AnyAction>>;
