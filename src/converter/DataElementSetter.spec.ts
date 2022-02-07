import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import extractDataAtomicValue from './DataAtomicConverter';
import extractAndSetChildren from './DataElementSetter';
import { getAllDataAtomicValuesWithNameInData } from './DataExtractor';

jest.mock('./DataAtomicConverter');

const mockExtractDataAtomicValue =
	extractDataAtomicValue as jest.MockedFunction<typeof extractDataAtomicValue>;

jest.mock('./DataExtractor');

const mockGetAllDataAtomicValuesWithNameInData =
	getAllDataAtomicValuesWithNameInData as jest.MockedFunction<
		typeof getAllDataAtomicValuesWithNameInData
	>;

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

const defaultMultipleTestDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someMultipleAtomicNameInData',
			value: 'someAtomicValue1',
		},
		{
			name: 'someMultipleAtomicNameInData',
			value: 'someAtomicValue2',
		},
		{
			name: 'someOtherNameInData',
			value: 'someAtomicValue2',
		},
		{
			name: 'someMultipleAtomicNameInData',
			value: 'someAtomicValue3',
		},
		{
			name: 'someMultipleAtomicNameInData',
			value: 'someAtomicValue4',
		},
	],
};

const defaulMultipleTestObjectMatcher: Matcher = {
	react: 'someMultipleField',
	cora: 'someMultipleAtomicNameInData',
	multiple: true,
};

let objectToSet = {};

beforeAll(() => {
	mockExtractDataAtomicValue.mockReturnValue('someDefaultValue');
	mockGetAllDataAtomicValuesWithNameInData.mockReturnValue([
		'someDefaultValue',
		'someDefaultValue2',
	]);
});

beforeEach(() => {
	objectToSet = {};
});

describe('The ElementSetter', () => {
	describe('DataAtomics', () => {
		describe('if not multiple', () => {
			it('if not required, calls extractDataAtomicValue with dataGroup and matcher', () => {
				extractAndSetChildren(
					defaultTestDataGroup,
					defaultTestObjectMatcher,
					objectToSet
				);
				expect(mockExtractDataAtomicValue).toHaveBeenCalledWith(
					defaultTestDataGroup,
					defaultTestObjectMatcher.cora
				);
			});

			it('adds value returned by extractDataAtomicValue to objectToSet with matcher.react as key', () => {
				mockExtractDataAtomicValue.mockReturnValueOnce('someValue');
				extractAndSetChildren(
					defaultTestDataGroup,
					defaultTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someAtomicName: 'someValue',
				});

				mockExtractDataAtomicValue.mockReturnValueOnce('someOtherValue');
				extractAndSetChildren(
					defaultTestDataGroup,
					defaultTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someAtomicName: 'someOtherValue',
				});
			});

			it('adds value returned by extractDataAtomicValue to objectToSet with OTHER matcher.react as key', () => {
				const testObjectMatcher: Matcher = {
					react: 'someOtherAtomicName',
					cora: 'someAtomicName',
				};
				mockExtractDataAtomicValue.mockReturnValueOnce('someValue');
				extractAndSetChildren(
					defaultTestDataGroup,
					testObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someOtherAtomicName: 'someValue',
				});
			});

			it('if extractDataAtomicValue returns undefined AND field not required, does not add value to object', () => {
				mockExtractDataAtomicValue.mockReturnValueOnce(undefined);
				extractAndSetChildren(
					defaultTestDataGroup,
					defaultTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).not.toHaveProperty('someAtomicName');
			});

			it('if extractDataAtomicValue returns undefined BUT field IS required, does add empty string to object', () => {
				mockExtractDataAtomicValue.mockReturnValueOnce(undefined);
				const testObjectMatcher: Matcher = {
					react: 'someAtomicName',
					cora: 'someAtomicName',
					required: true,
				};
				extractAndSetChildren(
					defaultTestDataGroup,
					testObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someAtomicName: '',
				});
			});
		});

		describe('if multiple', () => {
			it('does not call extractFirstDataAtomicWithNameInData', () => {
				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					defaulMultipleTestObjectMatcher,
					objectToSet
				);
				expect(mockExtractDataAtomicValue).not.toHaveBeenCalled();
			});

			it('does call getAllDataAtomicsWithNameInData with dataGroup, nameInData and matchingAttributes', () => {
				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					defaulMultipleTestObjectMatcher,
					objectToSet
				);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledWith(
					defaultMultipleTestDataGroup,
					defaulMultipleTestObjectMatcher.cora,
					undefined
				);

				const multipleTestObjectMatcher: Matcher = {
					react: 'someMultipleField',
					cora: 'someOTHERMultipleAtomicNameInData',
					multiple: true,
					matchingAttributes: [
						{
							key: 'lang',
							value: 'en',
						},
					],
				};

				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					multipleTestObjectMatcher,
					objectToSet
				);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledWith(
					defaultMultipleTestDataGroup,
					multipleTestObjectMatcher.cora,
					multipleTestObjectMatcher.matchingAttributes
				);
			});

			it('if getAllDataAtomicsWithNameInData returns empty array AND field not required, does not add anything to object', () => {
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([]);
				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					defaulMultipleTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).not.toHaveProperty('someMultipleField');
			});

			it('if getAllDataAtomicsWithNameInData returns empty array AND field IS required, DOES add empty array to object with matcher.react', () => {
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([]);
				const multipleTestObjectMatcher: Matcher = {
					react: 'someMultipleField',
					cora: 'someMultipleAtomicNameInData',
					multiple: true,
					required: true,
				};
				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					multipleTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someMultipleField: [],
				});
			});

			it('if getAllDataAtomicsWithNameInData returns empty array AND field IS required, DOES add empty array to object with other matcher.react', () => {
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([]);
				const multipleTestObjectMatcher: Matcher = {
					react: 'someOtherMultipleField',
					cora: 'someMultipleAtomicNameInData',
					multiple: true,
					required: true,
				};
				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					multipleTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someOtherMultipleField: [],
				});
			});

			it('if getAllDataAtomicValuesWithNameInData returns non-empty array, does add said array to object with matcher.react as key', () => {
				const arrayToAdd = ['someAtomic', 'someOtherAtomic', 'someMore'];
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someAtomic',
					'someOtherAtomic',
					'someMore',
				]);
				extractAndSetChildren(
					defaultMultipleTestDataGroup,
					defaulMultipleTestObjectMatcher,
					objectToSet
				);

				expect(objectToSet).toStrictEqual({
					someMultipleField: arrayToAdd,
				});
			});
		});
	});
});

// import { Matcher } from './Converter';
// import { DataGroup } from './CoraData';
// import extractAndSetDataAtomic from './DataAtomicConverter';

// const defaultTestDataGroup: DataGroup = {
// 	name: 'someName',
// 	children: [
// 		{
// 			name: 'someAtomicName',
// 			value: 'someAtomicValue',
// 		},
// 	],
// };

// const defaultTestObjectMatcher: Matcher = {
// 	react: 'someAtomicName',
// 	cora: 'someAtomicName',
// };

// let objectToReturn: any = {};

// beforeEach(() => {
// 	objectToReturn = {};
// });

// it('takes a DataGroup and a top-level-matcher', () => {
// 	extractAndSetDataAtomic(defaultTestDataGroup, defaultTestObjectMatcher, {});
// });

// describe('Handles DataAtomics', () => {
// 	describe('extracts a DataAtomic value from the top level and returns it', () => {
// 		it('with a value', () => {
// 			extractAndSetDataAtomic(
// 				defaultTestDataGroup,
// 				defaultTestObjectMatcher,
// 				objectToReturn
// 			);

// 			expect(objectToReturn).toHaveProperty('someAtomicName');
// 			expect(objectToReturn).toStrictEqual({
// 				someAtomicName: 'someAtomicValue',
// 			});
// 		});

// 		it('with another value', () => {
// 			const testDataGroup: DataGroup = {
// 				name: 'someName',
// 				children: [
// 					{
// 						name: 'someAtomicName',
// 						value: 'someOtherAtomicValue',
// 					},
// 				],
// 			};

// 			extractAndSetDataAtomic(
// 				testDataGroup,
// 				defaultTestObjectMatcher,
// 				objectToReturn
// 			);
// 			expect(objectToReturn).toStrictEqual({
// 				someAtomicName: 'someOtherAtomicValue',
// 			});
// 		});

// 		it('with a different name in data', () => {
// 			const testDataGroup: DataGroup = {
// 				name: 'someName',
// 				children: [
// 					{
// 						name: 'someAtomicName',
// 						value: 'someOtherAtomicValue',
// 					},
// 					{
// 						name: 'someOtherAtomicName',
// 						value: 'someInterestingAtomicValue',
// 					},
// 				],
// 			};
// 			const testObjectMatcher: Matcher = {
// 				react: 'someAtomicName',
// 				cora: 'someOtherAtomicName',
// 			};

// 			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

// 			expect(objectToReturn).toStrictEqual({
// 				someAtomicName: 'someInterestingAtomicValue',
// 			});
// 		});

// 		it('with a different react path', () => {
// 			const testDataGroup: DataGroup = {
// 				name: 'someName',
// 				children: [
// 					{
// 						name: 'someAtomicName',
// 						value: 'someOtherAtomicValue',
// 					},
// 					{
// 						name: 'someOtherAtomicName',
// 						value: 'someInterestingAtomicValue',
// 					},
// 				],
// 			};

// 			const testObjectMatcher: Matcher = {
// 				react: 'someOtherAtomicName',
// 				cora: 'someOtherAtomicName',
// 			};

// 			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);
// 			expect(objectToReturn).toHaveProperty('someOtherAtomicName');
// 			expect(objectToReturn).toStrictEqual({
// 				someOtherAtomicName: 'someInterestingAtomicValue',
// 			});
// 		});
// 	});

// 	it('does not fill the specified field if the DataAtomic does not exist', () => {
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
// 		};
// 		extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

// 		expect(objectToReturn).not.toHaveProperty('someAtomicName');
// 		expect(objectToReturn).toStrictEqual({});
// 	});

// 	it('does not fill the specified field if the children array is empty', () => {
// 		const testDataGroup: DataGroup = {
// 			name: 'someName',
// 			children: [],
// 		};
// 		const testObjectMatcher: Matcher = {
// 			react: 'someAtomicName',
// 			cora: 'someAtomicName',
// 		};

// 		extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

// 		expect(objectToReturn).not.toHaveProperty('someAtomicName');
// 		expect(objectToReturn).toStrictEqual({});
// 	});

// 	describe('does fill the specified field with an empty string if the DataAtomic does not exist BUT the field is required', () => {
// 		it('if the nameInData does not exist', () => {
// 			const testDataGroup: DataGroup = {
// 				name: 'someName',
// 				children: [
// 					{
// 						name: 'someOtherAtomicName',
// 						value: 'someOtherAtomicValue',
// 					},
// 				],
// 			};
// 			const testObjectMatcher: Matcher = {
// 				react: 'someAtomicName',
// 				cora: 'someAtomicName',
// 				required: true,
// 			};
// 			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

// 			expect(objectToReturn).toHaveProperty('someAtomicName');
// 			expect(objectToReturn).toStrictEqual({
// 				someAtomicName: '',
// 			});
// 		});
// 		it('if the children array is empty', () => {
// 			const testDataGroup: DataGroup = {
// 				name: 'someName',
// 				children: [],
// 			};
// 			const testObjectMatcher: Matcher = {
// 				react: 'someAtomicName',
// 				cora: 'someAtomicName',
// 				required: true,
// 			};

// 			extractAndSetDataAtomic(testDataGroup, testObjectMatcher, objectToReturn);

// 			expect(objectToReturn).toHaveProperty('someAtomicName');
// 			expect(objectToReturn).toStrictEqual({
// 				someAtomicName: '',
// 			});
// 		});
// 	});

// 	it.todo('handle single DataAtomics');
// 	it.todo('handle multiple DataAtomics');
// 	it.todo('handle single DataAtomics with attributes');
// 	it.todo('handle multiple DataAtomics with attributes');
// 	it.todo('');
// });
