(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
    (factory((global.reduxEasyActions = {}),global._));
}(this, (function (exports,_) { 'use strict';

    function EasyAction(type) {
        var ActionImpl = /** @class */ (function () {
            function ActionImpl() {
                this.type = type;
            }
            ActionImpl.OnStart = type + "-start";
            ActionImpl.OnComplete = type + "-complete";
            ActionImpl.OnSuccess = type + "-success";
            ActionImpl.OnError = type + "-error";
            ActionImpl.TYPE = type;
            return ActionImpl;
        }());
        return ActionImpl;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var defaultConfig = {
        dispatchLifecycleActions: true,
    };
    var easyActionsMiddleware = function (config) {
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

    function isAction(action, actionClass) {
        return action.type === actionClass.TYPE;
    }
    function beforeStart(action, actionClass) {
        return action.type === actionClass.OnStart;
    }
    function afterSuccess(action, actionClass) {
        return action.type === actionClass.OnSuccess;
    }
    function afterError(action, actionClass) {
        return action.type === actionClass.OnError;
    }
    function afterComplete(action, actionClass) {
        return action.type === actionClass.OnComplete;
    }

    // Import here Polyfills if needed. Recommended core-js (npm i -D core-js)

    exports.EasyAction = EasyAction;
    exports.easyActionsMiddleware = easyActionsMiddleware;
    exports.afterComplete = afterComplete;
    exports.afterError = afterError;
    exports.afterSuccess = afterSuccess;
    exports.beforeStart = beforeStart;
    exports.isAction = isAction;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=redux-easy-actions.umd.js.map
