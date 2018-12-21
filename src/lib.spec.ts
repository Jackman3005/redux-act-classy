import {Action} from "./lib";

describe('Action', () => {
    test('instance of action has type', () => {
        class TestAction extends Action('the-type') {
        }

        const action = new TestAction();

        expect(action.type).toBe('the-type');
    });

    test('class of action has type', () => {
        class TestAction extends Action('another-type') {
        }

        expect(TestAction.TYPE).toBe('another-type');
    });

    test('user added instance fields are accessible as well', () => {
        class TestAction extends Action('test-type') {
            constructor(readonly data: string) {super()}
        }

        const action = new TestAction('some-data');

        expect(action.data).toBe('some-data');
    });
});
