import { Classy, isAction, afterSuccess } from 'redux-act-classy'
import { AnyAction, Dispatch } from 'redux'
import { AppState } from './index'

export class UpdateDrinkCountAction extends Classy() {
  constructor(readonly numDrinksToFetch: number) { super()}
}

function sleep(ms: number) {
  return new Promise((resolve) => {setTimeout(resolve, ms)})
}

interface OrderDrinksResponse {
  price: number;
}

export class OrderDrinksAction extends Classy<OrderDrinksResponse>() {
  async perform(dispatch: Dispatch, getState: () => AppState) {
    await sleep(2500)
    return {
      price: getState().drinks.currentCount * 5.25,
    }
  }
}

export interface DrinksState {
  currentCount: number;
  totalPrice: number;
}

const defaultDrinksState: DrinksState = {
  totalPrice: 0,
  currentCount: 1,
}

function reducer(drinksState: DrinksState = defaultDrinksState, action: AnyAction) {
  if (isAction(action, UpdateDrinkCountAction)) {
    return {
      ...drinksState,
      currentCount: action.numDrinksToFetch,
    }
  } else if (afterSuccess(action, OrderDrinksAction)) {
    return {
      ...drinksState,
      totalPrice: drinksState.totalPrice + action.successResult.price,
    }
  }
  return drinksState
}

export default reducer

