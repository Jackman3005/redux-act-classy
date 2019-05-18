import { EasyAction } from '../src/redux-easy-actions'
import { uniq } from 'lodash'

describe('EasyAction', () => {
  test('user added fields work', () => {
    class TestAction extends EasyAction('test-type') {
      constructor(readonly myData: string) {
        super()
      }
    }

    const action = new TestAction('some-data')

    expect(action.myData).toBe('some-data')
  })

  describe('types', () => {
    class TestAction extends EasyAction('my-type') {}

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

    describe('when type is not provided', () => {
      test('will generate type', () => {
        class GeneratedTypeAction extends EasyAction() {}

        const action = new GeneratedTypeAction()

        const generatedType = action.type

        expect(generatedType).toMatch(/^EasyAction-[0-9]{1,3}$/)
        expect(GeneratedTypeAction.TYPE).toBe(generatedType)
        expect(GeneratedTypeAction.OnStart).toBe(generatedType + '-start')
        expect(GeneratedTypeAction.OnSuccess).toBe(generatedType + '-success')
        expect(GeneratedTypeAction.OnError).toBe(generatedType + '-error')
        expect(GeneratedTypeAction.OnComplete).toBe(generatedType + '-complete')
      })

      test('can create at least 1000 unique types', () => {
        const types: string[] = []
        for (let i = 0; i < 1000; i++) {
          class GeneratedTypeAction extends EasyAction() {}

          types.push(new GeneratedTypeAction().type)
        }
        expect(uniq(types)).toHaveLength(1000)
      })
    })
    describe('when user uses same type twice', () => {
      test('user is informed with a warning', () => {
        const warnSpy = spyOn(console, 'warn')

        class ActionA extends EasyAction('my-action') {}

        class ActionB extends EasyAction('my-action') {}

        expect(warnSpy).toHaveBeenCalled()
        const warningMessage = warnSpy.calls.first().args[0]
        expect(warningMessage).toContain('my-action')
      })
    })
  })

  describe('perform', () => {
    test('promise return type matches the given OUT generic type', async () => {
      interface JokeDetails {
        setup: string
        punchLine: string
      }

      class LoadJokeAction extends EasyAction<JokeDetails>('joke/load') {
        public perform = async () => {
          // do something asynchronously...
          return {
            setup: 'Two peanuts were walking down the street',
            punchLine: 'One of them was a salted'
          }
        }
      }

      const loadedJoke = await new LoadJokeAction().perform()

      expect(loadedJoke.setup).toEqual(
        'Two peanuts were walking down the street'
      )
      expect(loadedJoke.punchLine).toEqual('One of them was a salted')
    })
  })
})
