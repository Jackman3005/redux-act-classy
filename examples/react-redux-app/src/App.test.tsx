import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import { Provider } from 'react-redux'
import { compose, createStore, Dispatch } from 'redux'
import { AppState } from './index'

function renderWithRedux(component: JSX.Element, state: AppState, dispatch: Dispatch = jest.fn()) {
  const store = createStore((s = state) => s, state as AppState, compose())
  store.dispatch = dispatch
  return render(
    <Provider store={store}>
      {component}
    </Provider>,
  )
}

describe('<App/>', () => {
  let state: AppState
  beforeEach(() => {
    state = {
      drinks: {
        currentCount: 0,
        totalPrice: 0,
      },
      actions: {
        inProgress: {},
      },
    }
  })

  test('renders some text', () => {
    renderWithRedux(<App/>, state)

    const linkElement = screen.getByText(/How many drinks would you like?/i)
    expect(linkElement).toBeInTheDocument()
  })
})
