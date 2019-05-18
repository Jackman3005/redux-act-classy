"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesInUse = [];
function Classy(type) {
    //@ts-ignore
    if (this instanceof Classy) {
        console.error('Classy actions cannot be directly extended. \nTry using:  MyAction extends Classy() { } \nInstead of: MyAction extends Classy { }');
    }
    if (!type) {
        type = 'ClassyAction-' + typesInUse.length;
    }
    if (typesInUse.includes(type)) {
        console.warn("WARNING - this type: '" +
            type +
            "' has already been used for another action! " +
            'This will likely cause unexpected behavior. Please choose a new unique action type.');
    }
    typesInUse.push(type);
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
exports.Classy = Classy;
//# sourceMappingURL=ClassyAction.js.map