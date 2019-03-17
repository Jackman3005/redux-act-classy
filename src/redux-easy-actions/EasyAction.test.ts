import {EasyAction} from './EasyAction'

describe('EasyAction', () => {
    test('user added fields work', () => {
        class TestAction extends EasyAction('test-type') {
            constructor(readonly myData: string) {super()}
        }

        const action = new TestAction('some-data')

        expect(action.myData).toBe('some-data')
    })

    describe('types', () => {
        class TestAction extends EasyAction('my-type') {
        }

        test('instance of action has given type', () => {
            const action = new TestAction()

            expect(action.type).toBe('my-type')
        })

        test('class TYPE matches given type', () => {
            expect(TestAction.TYPE).toBe('my-type')
        })

        test('class lifecycle types append to given type', () => {
            expect(TestAction.OnStart).toBe('my-type-start')
            expect(TestAction.OnSuccess).toBe('my-type-success')
            expect(TestAction.OnError).toBe('my-type-error')
            expect(TestAction.OnComplete).toBe('my-type-complete')
        })
    })

    describe('doAsync', () => {
        test('promise return type matches the given OUT generic type', async () => {
            interface JokeDetails {
                setup: string;
                punchLine: string;
            }

            class LoadJokeAction extends EasyAction<JokeDetails>('joke/load') {
                public doAsync = async () => {
                    // do something asynchronously...
                    return {
                        setup: 'Two peanuts were walking down the street',
                        punchLine: 'One of them was a salted',
                    }
                }
            }

            const loadedJoke = await new LoadJokeAction().doAsync()

            expect(loadedJoke.setup).toEqual('Two peanuts were walking down the street')
            expect(loadedJoke.punchLine).toEqual('One of them was a salted')
        })
    })
})
