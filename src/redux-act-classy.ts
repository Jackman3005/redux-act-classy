// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import 'core-js/features/promise'

export { Classy } from './ClassyAction'
export { buildAClassyMiddleware } from './Middleware'
export {
  afterComplete,
  afterError,
  afterSuccess,
  beforeStart,
  isAction
} from './Helpers'

export {
  reducer as classyActionsReducer,
  ActionsState
} from './ActionsStateReducer'
