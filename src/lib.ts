import {Action} from "redux";

export function Action(type: string) {
    return class implements Action {
        public static TYPE = type;
        readonly type = type;
    }
}
