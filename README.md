# Redux Easy Actions

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

- Could add a reducer that stores all OnStart, etc states for each Action. 
e.g. `state.asyncActions[MyAction.TYPE].status`.
Multiple async actions of the same type (potentially with different data) may be going at the same time... (`new DeleteJokeAction({id: 5})`)
 
- Add tests to middleware
    - test that functions are not passed when deconstructing {...action}
- Add tests to helper functions

- Bug: Fix doAsync return types that are arrays. only able to determine they are any[] atm

- `doAsync` takes a `getState: () => T` T should be the defined top level state interface for
  users projects... How can we make this generic (without passing it into EACH new EasyAction)...