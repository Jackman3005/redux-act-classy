import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { ActionsState, classyActionsMiddleware, Classy, classyActionsReducer } from 'redux-act-classy'
import drinksStateReducer, { DrinksState } from './drinks.state'
import { Provider } from 'react-redux'

export interface AppState {
  actions: ActionsState,
  drinks: DrinksState
}

Classy.globalConfig.debugEnabled = true

const store = createStore(
  combineReducers<AppState>({
    actions: classyActionsReducer,
    drinks: drinksStateReducer,
  }),
  applyMiddleware(classyActionsMiddleware),
)


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
