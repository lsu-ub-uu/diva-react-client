import {
	completePerson,
	completePersonObject,
} from '../../../testData/personTestData';
import createPersonFromPersonObject from './createPersonFromPersonObject';

describe('createPersonFromPersonObject', () => {
	it('takes a PersonObject and returns a person', () => {
		const person = createPersonFromPersonObject(completePersonObject);
		expect(person).toBeDefined();
	});

	it('converts the personObject correctly to a new Person', () => {
		const person = createPersonFromPersonObject(completePersonObject);
		expect(JSON.stringify(person)).toStrictEqual(
			JSON.stringify(completePerson)
		);
	});
});
