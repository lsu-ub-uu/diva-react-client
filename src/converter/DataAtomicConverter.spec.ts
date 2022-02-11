import { FieldMatcher } from './Converter';
import { DataGroup } from './CoraData';
import extractDataAtomicValue from './DataAtomicConverter';

const defaultTestDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
	],
};

const defaultTestObjectMatcher: FieldMatcher = {
	react: 'someAtomicName',
	cora: 'someAtomicName',
};

describe('extractDataAtomicValue', () => {
	it('takes a DataGroup and a top-level-matcher', () => {
		extractDataAtomicValue(defaultTestDataGroup, defaultTestObjectMatcher.cora);
	});

	describe('Handles DataAtomics', () => {
		describe('extracts a DataAtomic value from the top level and returns it', () => {
			it('with a value', () => {
				const value = extractDataAtomicValue(
					defaultTestDataGroup,
					defaultTestObjectMatcher.cora
				);

				expect(value).toStrictEqual('someAtomicValue');
			});

			it('with another value', () => {
				const testDataGroup: DataGroup = {
					name: 'someName',
					children: [
						{
							name: 'someAtomicName',
							value: 'someOtherAtomicValue',
						},
					],
				};

				const value = extractDataAtomicValue(
					testDataGroup,
					defaultTestObjectMatcher.cora
				);
				expect(value).toStrictEqual('someOtherAtomicValue');
			});

			it('with a different name in data', () => {
				const testDataGroup: DataGroup = {
					name: 'someName',
					children: [
						{
							name: 'someAtomicName',
							value: 'someOtherAtomicValue',
						},
						{
							name: 'someOtherAtomicName',
							value: 'someInterestingAtomicValue',
						},
					],
				};
				const testObjectMatcher: FieldMatcher = {
					react: 'someAtomicName',
					cora: 'someOtherAtomicName',
				};

				const value = extractDataAtomicValue(
					testDataGroup,
					testObjectMatcher.cora
				);

				expect(value).toStrictEqual('someInterestingAtomicValue');
			});
		});

		describe('does NOT fill the specified field with an empty string if the DataAtomic does not exist', () => {
			it('if the DataAtomic does not exist', () => {
				const testDataGroup: DataGroup = {
					name: 'someName',
					children: [
						{
							name: 'someOtherAtomicName',
							value: 'someOtherAtomicValue',
						},
					],
				};
				const testObjectMatcher: FieldMatcher = {
					react: 'someAtomicName',
					cora: 'someAtomicName',
				};
				const value = extractDataAtomicValue(
					testDataGroup,
					testObjectMatcher.cora
				);

				expect(value).toBeUndefined();
			});

			it('if the children array is empty', () => {
				const testDataGroup: DataGroup = {
					name: 'someName',
					children: [],
				};
				const testObjectMatcher: FieldMatcher = {
					react: 'someAtomicName',
					cora: 'someAtomicName',
				};

				const value = extractDataAtomicValue(
					testDataGroup,
					testObjectMatcher.cora
				);

				expect(value).toBeUndefined();
			});
		});

		// describe('does fill the specified field with an empty string if the DataAtomic does not exist BUT the field is required', () => {
		// 	it('if the nameInData does not exist', () => {
		// 		const testDataGroup: DataGroup = {
		// 			name: 'someName',
		// 			children: [
		// 				{
		// 					name: 'someOtherAtomicName',
		// 					value: 'someOtherAtomicValue',
		// 				},
		// 			],
		// 		};
		// 		const testObjectMatcher: Matcher = {
		// 			react: 'someAtomicName',
		// 			cora: 'someAtomicName',
		// 			required: true,
		// 		};
		// 		const value = extractDataAtomicValue(
		// 			testDataGroup,
		// 			testObjectMatcher.cora,
		// 			testObjectMatcher.required
		// 		);

		// 		expect(value).toStrictEqual('');
		// 	});
		// 	it('if the children array is empty', () => {
		// 		const testDataGroup: DataGroup = {
		// 			name: 'someName',
		// 			children: [],
		// 		};
		// 		const testObjectMatcher: Matcher = {
		// 			react: 'someAtomicName',
		// 			cora: 'someAtomicName',
		// 			required: true,
		// 		};

		// 		const value = extractDataAtomicValue(
		// 			testDataGroup,
		// 			testObjectMatcher.cora,
		// 			testObjectMatcher.required
		// 		);

		// 		expect(value).toStrictEqual('');
		// 	});
		// });

		it.todo('handle single DataAtomics with attributes');
	});
});
