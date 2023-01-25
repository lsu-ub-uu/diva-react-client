import * as des from '../ElementSetter';

describe('possiblySetReturnValue', () => {
	it('takes value, fieldName, multiple and required', () => {
		des.possiblySetReturnValue('someValue', 'fieldName', true, true);
	});

	it('if value is undefined and required===false, return empty object', () => {
		let returned = des.possiblySetReturnValue(
			undefined,
			'fieldName',
			false,
			false
		);

		expect(returned).toBeUndefined();

		returned = des.possiblySetReturnValue(undefined, 'fieldName');

		expect(returned).toBeUndefined();

		returned = des.possiblySetReturnValue(
			undefined,
			'fieldName',
			undefined,
			true
		);

		expect(returned).toBeUndefined();
	});

	it('if value is undefined, required===true and multiple===false, return object containing fieldName: ""', () => {
		let returned = des.possiblySetReturnValue(
			undefined,
			'fieldName',
			true,
			false
		);

		expect(returned).toStrictEqual({
			fieldName: '',
		});

		returned = des.possiblySetReturnValue(
			undefined,
			'otherFieldName',
			true,
			false
		);

		expect(returned).toStrictEqual({
			otherFieldName: '',
		});
	});

	it('if value is undefined, required===true and multiple===true, return object containing fieldName: []', () => {
		let returned = des.possiblySetReturnValue(
			undefined,
			'fieldName',
			true,
			true
		);

		expect(returned).toStrictEqual({
			fieldName: [],
		});

		returned = des.possiblySetReturnValue(
			undefined,
			'otherFieldName',
			true,
			true
		);

		expect(returned).toStrictEqual({
			otherFieldName: [],
		});
	});

	it('if value is not undefined, return object containing fieldName: value', () => {
		let returned = des.possiblySetReturnValue('someValue', 'fieldName');

		expect(returned).toStrictEqual({
			fieldName: 'someValue',
		});

		returned = des.possiblySetReturnValue(
			['someValue'],
			'someOtherFieldName'
		);

		expect(returned).toStrictEqual({
			someOtherFieldName: ['someValue'],
		});

		returned = des.possiblySetReturnValue(
			{ someKey: 'someValue' },
			'fieldName'
		);

		expect(returned).toStrictEqual({
			fieldName: { someKey: 'someValue' },
		});

		returned = des.possiblySetReturnValue(
			[{ someKey: 'someValue' }],
			'fieldName'
		);

		expect(returned).toStrictEqual({
			fieldName: [{ someKey: 'someValue' }],
		});
	});
});
