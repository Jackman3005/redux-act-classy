import {Action, Reducer} from 'redux'
import {CompleteAction, StartAction} from './Helpers'

export interface ActionInfoState {
  anyPending: boolean
  pendingActionsCount: number
  actions: { [actionType: string]: ActionDetails }
}

// var properties = {
//   phone : {
//     value: "123456789"
//   }
// }
//
// var handler = {
//   get: function(target, name) {
//     return target.hasOwnProperty(name) ? target[name] : {};
//   }
// };
//
// var new_properties = new Proxy(properties, handler);


export interface ActionDetails {
  anyPending: boolean
  pendingActionsCount: number
}

const defaultState: ActionInfoState = {
  anyPending: false,
  pendingActionsCount: 0,
  actions: {},
}

function isStartAction(action: Action): action is StartAction<any, any> {
  return action.type && action.type.endsWith('-start')
}

function isCompleteAction(action: Action): action is CompleteAction<any, any> {
  return action.type && action.type.endsWith('-complete')
}

const reducer: Reducer<ActionInfoState, Action> = (state: ActionInfoState = defaultState, action: Action): ActionInfoState => {
  if (isStartAction(action)) {
    const incrementedPendingActionsCount = state.pendingActionsCount + 1
    const incrementedActionSpecificPendingCount = (state.actions[action.type]?.pendingActionsCount || 0) + 1
    return {
      ...state,
      pendingActionsCount: incrementedPendingActionsCount,
      anyPending: incrementedPendingActionsCount > 0,
      actions: {
        ...state.actions,
        [action.actionData.type]: {
          pendingActionsCount: incrementedActionSpecificPendingCount,
          anyPending: incrementedActionSpecificPendingCount > 0,
        },
      },
    }
  } else if (isCompleteAction(action)) {
    const decrementedPendingActionsCount = state.pendingActionsCount - 1
    const decrementedActionSpecificPendingCount = (state.actions[action.type]?.pendingActionsCount || 0) - 1
    return {
      ...state,
      pendingActionsCount: decrementedPendingActionsCount,
      anyPending: decrementedPendingActionsCount > 0,
      actions: {
        ...state.actions,
        [action.actionData.type]: {
          pendingActionsCount: decrementedActionSpecificPendingCount,
          anyPending: decrementedActionSpecificPendingCount > 0,
        },
      },
    }
  } else {
    return state
  }
}


export default reducer