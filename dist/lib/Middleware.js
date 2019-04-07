"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var defaultConfig = {
    dispatchLifecycleActions: true,
};
exports.easyActionsMiddleware = function (config) {
    return function (_a) {
        var dispatch = _a.dispatch, getState = _a.getState;
        return function (next) { return function (action) {
            var dispatchLifecycleActions = Object.assign(defaultConfig, config).dispatchLifecycleActions;
            var actionIsAClass = !_.isPlainObject(action);
            if (actionIsAClass) {
                var actionAsObject_1 = extractNonFunctionFields(action);
                var isAsynchronousAction = _.isFunction(action.doAsync);
                if (isAsynchronousAction) {
                    if (dispatchLifecycleActions) {
                        dispatch({
                            actionData: actionAsObject_1,
                            type: action.constructor.OnStart,
                        });
                    }
                    return action.doAsync(dispatch, getState)
                        .then(function (successResult) { return dispatchLifecycleActions && dispatch({
                        actionData: actionAsObject_1,
                        type: action.constructor.OnSuccess,
                        successResult: successResult,
                    }); })
                        .catch(function (errorResult) { return dispatchLifecycleActions && dispatch({
                        actionData: actionAsObject_1,
                        type: action.constructor.OnError,
                        errorResult: errorResult,
                    }); })
                        .finally(function () { return dispatchLifecycleActions && dispatch({
                        actionData: actionAsObject_1,
                        type: action.constructor.OnComplete,
                    }); });
                }
                else {
                    return next(__assign({}, actionAsObject_1));
                }
            }
            else {
                return next(action);
            }
        }; };
    };
};
var extractNonFunctionFields = function (obj) {
    var cleanedObj = {};
    Object.keys(obj)
        .filter(function (key) { return !_.isFunction(obj[key]); })
        .forEach(function (key) {
        cleanedObj[key] = obj[key];
    });
    return cleanedObj;
};
//# sourceMappingURL=Middleware.js.map