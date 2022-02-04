import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import extractAndSetDataAtomic from './DataAtomicConverter';

const defaultTestDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
	],
};

const defaultTestObjectMatcher: Matcher = {
	react: 'someAtomicName',
	cora: 'someAtomicName',
};

let objectToReturn: any = {};

beforeEach(() => {
	objectToReturn = {};
});

it('takes a DataGroup and a top-level-matcher', () => {
	extractAndSetDataAtomic(defaultTestDataGroup, defaultTestObjectMatcher, {});
});

describe('Handles DataAtomics', () => {
	describe('extracts a DataAtomic value from the top level and returns an Object containing it', () => {
		it('with a value', () => {
			extractAndSetDataAtomic(
				defaultTestDataGroup,
				defaultTestObjectMatcher,
				objectToReturn
			);

			expect(objectToReturn).toHaveProperty('someAtomicName');
			expect(objectToReturn).toStrictEqual({
				someAtomicName: 'someAtomicValue',
			});
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

			extractAndSetDataAtomic(
				testDataGroup,
				defaultTestObjectMatcher,
				objectToReturn
			);
			expect(objectToReturn).toStrictEqual({
				someAtomicName: 'someOtherAtomicValue',
			});
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
			const testObjectMatcher: Matcher = {
				react: 'someAtomicName',
				cora: 'someOtherAtomicName',
			};

			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

			expect(objectToReturn).toStrictEqual({
				someAtomicName: 'someInterestingAtomicValue',
			});
		});

		it('with a different react path', () => {
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

			const testObjectMatcher: Matcher = {
				react: 'someOtherAtomicName',
				cora: 'someOtherAtomicName',
			};

			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);
			expect(objectToReturn).toHaveProperty('someOtherAtomicName');
			expect(objectToReturn).toStrictEqual({
				someOtherAtomicName: 'someInterestingAtomicValue',
			});
		});
	});

	it('does not fill the specified field if the DataAtomic does not exist', () => {
		const testDataGroup: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someOtherAtomicName',
					value: 'someOtherAtomicValue',
				},
			],
		};
		const testObjectMatcher: Matcher = {
			react: 'someAtomicName',
			cora: 'someAtomicName',
		};
		extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

		expect(objectToReturn).not.toHaveProperty('someAtomicName');
		expect(objectToReturn).toStrictEqual({});
	});

	it('does not fill the specified field if the children array is empty', () => {
		const testDataGroup: DataGroup = {
			name: 'someName',
			children: [],
		};
		const testObjectMatcher: Matcher = {
			react: 'someAtomicName',
			cora: 'someAtomicName',
		};

		extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

		expect(objectToReturn).not.toHaveProperty('someAtomicName');
		expect(objectToReturn).toStrictEqual({});
	});

	describe('does fill the specified field with an empty string if the DataAtomic does not exist BUT the field is required', () => {
		it('if the nameInData does not exist', () => {
			const testDataGroup: DataGroup = {
				name: 'someName',
				children: [
					{
						name: 'someOtherAtomicName',
						value: 'someOtherAtomicValue',
					},
				],
			};
			const testObjectMatcher: Matcher = {
				react: 'someAtomicName',
				cora: 'someAtomicName',
				required: true,
			};
			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

			expect(objectToReturn).toHaveProperty('someAtomicName');
			expect(objectToReturn).toStrictEqual({
				someAtomicName: '',
			});
		});
		it('if the children array is empty', () => {
			const testDataGroup: DataGroup = {
				name: 'someName',
				children: [],
			};
			const testObjectMatcher: Matcher = {
				react: 'someAtomicName',
				cora: 'someAtomicName',
				required: true,
			};

			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

			expect(objectToReturn).toHaveProperty('someAtomicName');
			expect(objectToReturn).toStrictEqual({
				someAtomicName: '',
			});
		});
	});
});
