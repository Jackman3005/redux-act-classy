// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import {EasyAction} from './EasyAction'
import {easyActionsMiddleware} from './Middleware'
import {afterComplete, afterError, afterSuccess, beforeStart, isAction} from './Helpers'

export default {
  EasyAction,
  easyActionsMiddleware,
  isAction,
  beforeStart,
  afterSuccess,
  afterError,
  afterComplete,
}
