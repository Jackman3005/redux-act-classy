"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.EasyAction = EasyAction;
//# sourceMappingURL=EasyAction.js.map