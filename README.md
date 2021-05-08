# Redux Act Classy
Make Redux classier with Async Lifecycle Actions that take a 
modern approach to redux action creation.

[![Build Status](https://travis-ci.org/Jackman3005/redux-act-classy.svg?branch=master)](https://travis-ci.org/Jackman3005/redux-act-classy)
[![Coverage Status](https://coveralls.io/repos/github/Jackman3005/redux-act-classy/badge.svg?branch=master)](https://coveralls.io/github/Jackman3005/redux-act-classy?branch=master)

### Examples
Are you a hands-on learner? Checkout this example project!
[React Redux example app](examples/react-redux-app)

### Docs
Documentation is auto-generated but encompasses all exported members of the library.
[View the documentation](https://blog.jackcoy.io/redux-act-classy/)

### Define a basic action
##### A basic action with a generated type
```javascript
class MyAction extends Classy() {
}
```
<br />

##### A basic action with a manually specified type
```javascript
class MyAction extends Classy('my-action') {
}
```
<br />

##### A basic action with some data
```typescript
// Using TypeScript
class MyAction extends Classy() {
  constructor(readonly data: string) { super() }
}
```

```javascript
// Using JavaScript
class MyAction extends Classy() {
  constructor(data) { 
    super()
    this.data = data
  }
}
```
<br />

### Define an asynchronous action
```typescript
class LoadJokeAction extends Classy<JokeDetails>() {
    public perform = async (dispatch, getState) => {
      // do something asynchronously... e.g. await fetch()
      return {
        setup: 'Two peanuts were walking down the street',
        punchLine: 'One of them was a salted'
      }
    }
}
```
<br />

### Dispatch actions
##### An action with data
```typescript
dispatch(new MyAction('some-data'))
```
##### An async action
Asynchronous actions are not directly received by reducers.
Instead, Lifecycle actions are automatically dispatched
to report information on the state of asynchronous activity. 
```typescript
dispatch(new LoadJokeAction()) // nothing interesting here
```
<br />

### Identify actions in your reducer function
##### When using TypeScript
[Typescript Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
allow the reducer helper functions (`isAction`, `beforeStart`, `afterSuccess`, etc) to add type information to the action within the `if` block.

```typescript
// Identify basic actions
if (isAction(action, MyAction)) {
  // action is a MyAction
}

// Identify asynchronous lifecycle actions
if (beforeStart(action, LoadJokeAction)) {
  state = {
    showSpinner: true
  }
} else if (afterSuccess(action, LoadJokeAction)) {
  state = {
    showSpinner: false,
    joke: action.successResult
  }
}
```
##### When using JavaScript
```javascript
switch(action.type) {

  // Identify basic actions
  case MyAction.TYPE:
    // action is a MyAction
    

  // Identify asynchronous lifecycle actions
  case LoadJokeAction.OnStart:
    state = {
      showSpinner: true
    }
  case LoadJokeAction.OnSuccess:
    state = {
      showSpinner: false,
      data: action.successResult.data
    }
}
```
<br />
<br />

## Set Up

##### Add the package to your project
```bash
yarn add redux-act-classy

# or

npm install redux-act-classy --save
```

##### Add the middleware to your redux store
In Redux you can only dispatch plain object actions. To get around
this design, we need a middleware to intercept our Classy actions and
convert them into plain object actions (removing all functions and leaving
only data properties) before passing them along to the reducer functions.

The middleware is responsible for calling `perform` on asynchronous
actions and dispatching the Lifecycle Actions.

```javascript
import { buildAClassyMiddleware } from 'redux-act-classy'

// You may optionally pass an object to the build method to configure the middleware
const classyMiddleware = buildAClassyMiddleware()

const reduxStore = createStore(
    combineReducers({
        someReducer,
        anotherReducer
    }),
    {},
    compose(applyMiddleware(classyMiddleware))
)
```

<br />
<br />

## Motivation
I came up with some of the ideas for this library while trudging
through the action portion of the redux ecosystem.

I've found it cumbersome to deal with
- action creators
- action types
- accessing action data in reducers (esp. w/ type friendliness)
- async thunk actions that result in multiple concrete actions to record the current
  lifecycle stage of the async action (Start/Success/Fail/etc) for loading spinners etc
  
Each of these individually are not that bad, but taken as a whole I felt
like there should be a simpler way to do these things.


## Goals

### Types are first class

With the growing popularity of typescript, it makes sense to provide a solution that
improves developing in typescript as well as a javascript.

### Simplistic usage

I want users to feel like this is the way actions were meant to be used.

### Fully tested codebase

I work in a Test Driven Design environment, and I think it's important to bring that level 
of confident development to this library so that others can have confidence in using this 
library for their production environments.

## Contributing

TODO: project setup instructions...

Currently I am doing most of this by myself. If you have thoughts, inspiration, feedback, or
want to add a feature. Feel free to reach out or send a pull request!


## Task List

- Could add a reducer that stores all lifecycle states: OnStart, etc for each Action. 
e.g. `state.asyncActions[MyAction.TYPE].status`.
Multiple async actions of the same type (potentially with different data) may be going at the same time... (`new DeleteJokeAction({id: 5})`)
 
- Add tests to middleware
    - test that functions are not passed when deconstructing {...action}
- Add tests to helper functions

- Bug: Fix perform return types that are arrays. only able to determine they are any[] atm

- `perform` takes a `getState: () => T` T should be the defined top level state interface for
  users projects... How can we make this generic (without passing it into EACH new ClassyAction)...
