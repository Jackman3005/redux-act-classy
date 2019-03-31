import { EasyAction } from './EasyAction';
import { afterComplete, afterError, afterSuccess, beforeStart, isAction } from './Helpers';
declare const _default: {
    EasyAction: typeof EasyAction;
    easyActionsMiddleware: (config?: Partial<import("./Middleware").EasyActionMiddlewareConfig> | undefined) => import("redux").Middleware<{}, any, import("redux").Dispatch<import("redux").AnyAction>>;
    isAction: typeof isAction;
    beforeStart: typeof beforeStart;
    afterSuccess: typeof afterSuccess;
    afterError: typeof afterError;
    afterComplete: typeof afterComplete;
};
export default _default;
