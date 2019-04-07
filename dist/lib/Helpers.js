"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAction(action, actionClass) {
    return action.type === actionClass.TYPE;
}
exports.isAction = isAction;
function beforeStart(action, actionClass) {
    return action.type === actionClass.OnStart;
}
exports.beforeStart = beforeStart;
function afterSuccess(action, actionClass) {
    return action.type === actionClass.OnSuccess;
}
exports.afterSuccess = afterSuccess;
function afterError(action, actionClass) {
    return action.type === actionClass.OnError;
}
exports.afterError = afterError;
function afterComplete(action, actionClass) {
    return action.type === actionClass.OnComplete;
}
exports.afterComplete = afterComplete;
//# sourceMappingURL=Helpers.js.map