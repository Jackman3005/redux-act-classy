import React, { ChangeEvent } from 'react'
import logo from './logo.svg'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { OrderDrinksAction, UpdateDrinkCountAction } from './drinks.state'
import { AppState } from './index'

function App() {
  const numDrinks = useSelector<AppState, number>(state => state.drinks.currentCount)
  const totalPrice = useSelector<AppState, number>(state => state.drinks.totalPrice)
  const orderInProgress = useSelector<AppState, number>(state => state.actions.inProgress[OrderDrinksAction.TYPE])
  const dispatch = useDispatch()

  function updateNumberOfDrinks(event: ChangeEvent<HTMLInputElement>) {
    const numDrinks = parseInt(event.target.value)
    dispatch(new UpdateDrinkCountAction(numDrinks))
  }

  function orderDrinks() {
    dispatch(new OrderDrinksAction())
  }

  return (
    <div className="App">
      <header className="App-header">
        {!!orderInProgress && <img width={100} src={logo} className="App-logo" alt="logo"/>}
        {!orderInProgress && <div style={{ height: 70 }}/>}
        <div>
          <p>How many drinks would you like?</p>
          <input
            className="drinks-counter"
            value={numDrinks}
            onChange={updateNumberOfDrinks}
            type="number"
          />
          <button
            className="order-button"
            onClick={orderDrinks}
          >Order
          </button>
        </div>
        {!!orderInProgress && (
          <div>Processing order...</div>
        ) || <div>&nbsp;</div>
        }
        <div>
          <br/>
          You owe: ${totalPrice}
        </div>
      </header>
    </div>
  )
}

export default App
