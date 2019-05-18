import { Middleware } from 'redux';
export interface MiddlewareConfig {
    dispatchLifecycleActions: boolean;
}
export declare const buildAClassyMiddleware: (config?: Partial<MiddlewareConfig> | undefined) => Middleware<{}, any, import("redux").Dispatch<import("redux").AnyAction>>;
