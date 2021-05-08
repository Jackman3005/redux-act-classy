import { AnyAction } from 'redux'

type NumberOfActionsInProgress = number
type ActionType = string

export interface ActionsState {
  inProgress: { [key in ActionType]: NumberOfActionsInProgress }
}

const defaultState: ActionsState = {
  inProgress: {}
}

export function reducer(
  oldState: ActionsState = defaultState,
  action: AnyAction
) {
  if (startAction(action)) {
    const baseActionType = action.type.replace(/-start$/, '')

    return {
      ...oldState,
      inProgress: {
        ...oldState.inProgress,
        [baseActionType]: (oldState.inProgress[baseActionType] || 0) + 1
      }
    }
  } else if (endAction(action)) {
    const baseActionType = action.type.replace(/-complete$/, '')

    return {
      ...oldState,
      inProgress: {
        ...oldState.inProgress,
        [baseActionType]: oldState.inProgress[baseActionType] - 1
      }
    }
  }

  return oldState
}

function startAction(action: AnyAction) {
  return action && action.type && action.type.endsWith('-start')
}

function endAction(action: AnyAction) {
  return action && action.type && action.type.endsWith('-complete')
}
