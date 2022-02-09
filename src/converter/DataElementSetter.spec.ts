import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import extractDataAtomicValue from './DataAtomicConverter';
import * as des from './DataElementSetter';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	getDataGroupWithNameInDatas,
	getFinalDataAtomicValueWithNameInDatas,
} from './DataExtractor';

jest.mock('./DataAtomicConverter');

const mockExtractDataAtomicValue =
	extractDataAtomicValue as jest.MockedFunction<typeof extractDataAtomicValue>;

jest.mock('./DataExtractor');

const mockGetAllDataAtomicValuesWithNameInData =
	extractAllDataAtomicValuesFollowingNameInDatas as jest.MockedFunction<
		typeof extractAllDataAtomicValuesFollowingNameInDatas
	>;

const mockGetFinalDataAtomicValueWithNameInDatas =
	getFinalDataAtomicValueWithNameInDatas as jest.MockedFunction<
		typeof getFinalDataAtomicValueWithNameInDatas
	>;

const mockGetDataGroupWithNameInDatas =
	getDataGroupWithNameInDatas as jest.MockedFunction<
		typeof getDataGroupWithNameInDatas
	>;

const defaultDataAtomicDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
	],
};

const defaultDataAtomicObjectMatcher: Matcher = {
	react: 'someAtomicName',
	cora: 'someAtomicName',
};

const defaultMultipleDataAtomicDataGroup: DataGroup = {
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

const defaulMultipleDataAtomicObjectMatcher: Matcher = {
	react: 'someMultipleField',
	cora: 'someMultipleAtomicNameInData',
	multiple: true,
};

// let objectToSet = {};

beforeAll(() => {
	mockExtractDataAtomicValue.mockReturnValue(
		'someDefaultValueFromExtractDataAtomicValue'
	);
	mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValue(
		'someDefaultValueFromGetFinalDataAtomicValueWithNameInDatas'
	);

	mockGetDataGroupWithNameInDatas.mockReturnValue(undefined);

	mockGetAllDataAtomicValuesWithNameInData.mockReturnValue([
		'someDefaultValue',
		'someDefaultValue2',
	]);
});

beforeEach(() => {
	// objectToSet = {};
});

describe('The ElementSetter', () => {
	describe('DataAtomics', () => {
		it('does call getNameInDatasFromPath', () => {
			const getNameInDatasFromPathSpy = jest.spyOn(
				des,
				'getNameInDatasFromPath'
			);

			const someDataGroup: DataGroup = {
				name: 'someName',
				children: [],
			};

			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataAtomic',
				multiple: true,
			};

			des.extractAndSetChildren(someDataGroup, someMatcher);

			expect(getNameInDatasFromPathSpy).toHaveBeenLastCalledWith(
				someMatcher.cora
			);

			const someOtherMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someDataGroup/someDataAtomic',
				required: true,
			};

			des.extractAndSetChildren(someDataGroup, someOtherMatcher);

			expect(getNameInDatasFromPathSpy).toHaveBeenLastCalledWith(
				someOtherMatcher.cora
			);
		});

		describe('if not multiple', () => {
			it('calls getFinalDataAtomicValueWithNameInDatas with dataGroup, result from getNameInDatasFromPath and matcher', () => {
				des.extractAndSetChildren(
					defaultDataAtomicDataGroup,
					defaultDataAtomicObjectMatcher
				);
				expect(
					mockGetFinalDataAtomicValueWithNameInDatas
				).toHaveBeenLastCalledWith(
					defaultDataAtomicDataGroup,
					['someAtomicName'],
					undefined
				);

				const someDataGroup: DataGroup = {
					name: 'someName',
					children: [],
				};

				const someOtherMatcher: Matcher = {
					react: 'someField',
					cora: 'someDataGroup/someDataGroup/someDataAtomic',
					required: true,
					matchingAttributes: [{ key: 'someKey', value: 'someValue' }],
				};

				des.extractAndSetChildren(someDataGroup, someOtherMatcher);

				expect(
					mockGetFinalDataAtomicValueWithNameInDatas
				).toHaveBeenLastCalledWith(
					someDataGroup,
					['someDataGroup', 'someDataGroup', 'someDataAtomic'],
					someOtherMatcher.matchingAttributes
				);
			});

			it('returns value returned by getFinalDataAtomicValueWithNameInDatas', () => {
				mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(
					'someFinalValue'
				);
				const returnedValue = des.extractAndSetChildren(
					defaultDataAtomicDataGroup,
					defaultDataAtomicObjectMatcher
				);

				expect(returnedValue).toStrictEqual('someFinalValue');

				mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(
					'someOtherValue'
				);
				const returnedValue2 = des.extractAndSetChildren(
					defaultDataAtomicDataGroup,
					defaultDataAtomicObjectMatcher
				);

				expect(returnedValue2).toStrictEqual('someOtherValue');
			});

			it('adds value returned by extractDataAtomicValue to objectToSet with OTHER matcher.react as key', () => {
				const testObjectMatcher: Matcher = {
					react: 'someOtherAtomicName',
					cora: 'someAtomicName',
				};
				mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(
					'someValue'
				);
				const returnedValue = des.extractAndSetChildren(
					defaultDataAtomicDataGroup,
					testObjectMatcher
				);

				expect(returnedValue).toStrictEqual('someValue');
			});
		});

		describe('if multiple', () => {
			it('does not call extractFirstDataAtomicWithNameInData', () => {
				des.extractAndSetChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);
				expect(mockExtractDataAtomicValue).not.toHaveBeenCalled();
			});

			it('does call getAllDataAtomicsWithNameInData with dataGroup and nameInData from getNameInDatasFromPath', () => {
				des.extractAndSetChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledWith(
					defaultMultipleDataAtomicDataGroup,
					[defaulMultipleDataAtomicObjectMatcher.cora]
				);

				const multipleTestObjectMatcher: Matcher = {
					react: 'someMultipleField',
					cora: 'someDataGroupNameInData/someMultipleDataAtomicNameInData',
					multiple: true,
					matchingAttributes: [
						{
							key: 'lang',
							value: 'en',
						},
					],
				};

				des.extractAndSetChildren(
					defaultMultipleDataAtomicDataGroup,
					multipleTestObjectMatcher
				);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledWith(
					defaultMultipleDataAtomicDataGroup,
					['someDataGroupNameInData', 'someMultipleDataAtomicNameInData']
				);
			});

			it('returns value returned by getAllDataAtomicValuesWithNameInData', () => {
				const arrayToAdd = ['someAtomic', 'someOtherAtomic', 'someMore'];
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someAtomic',
					'someOtherAtomic',
					'someMore',
				]);
				const returnedValue = des.extractAndSetChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);

				expect(returnedValue).toStrictEqual(arrayToAdd);
			});
		});
	});

	describe('If a matcher was passed', () => {
		const someDefaultFinalMatcher: Matcher = {
			react: 'someFinalField',
			cora: 'someOtherDataAtomic',
		};

		const someDefaultDataGroup: DataGroup = {
			name: 'someName',
			children: [],
		};

		it('expect getDataGroupWithNameInDatas to have been called with dataGroup, nameInDatas from getNameInDatasFromPath and matchingAttributes', () => {
			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			des.extractAndSetChildren(someDefaultDataGroup, someMatcher);

			expect(mockGetDataGroupWithNameInDatas).toHaveBeenLastCalledWith(
				someDefaultDataGroup,
				['someDataGroup', 'someOtherDataGroup'],
				undefined
			);

			const someOtherMatcher: Matcher = {
				react: 'someField',
				cora: 'someOtherDataGroup/someFinalDataGroup',
				matcher: someDefaultFinalMatcher,
				matchingAttributes: [{ key: 'someKey', value: 'someValue' }],
			};

			const someOtherDataGroup: DataGroup = {
				name: 'someName',
				children: [
					{
						name: 'someName',
						value: 'someValue',
					},
				],
			};

			des.extractAndSetChildren(someOtherDataGroup, someOtherMatcher);

			expect(mockGetDataGroupWithNameInDatas).toHaveBeenLastCalledWith(
				someOtherDataGroup,
				['someOtherDataGroup', 'someFinalDataGroup'],
				someOtherMatcher.matchingAttributes
			);
		});

		it('expect getAllDataAtomicValuesWithNameInData and getFinalDataAtomicValueWithNameInDatas to not be called', () => {
			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			des.extractAndSetChildren(someDefaultDataGroup, someMatcher);

			expect(mockGetAllDataAtomicValuesWithNameInData).not.toHaveBeenCalled();

			expect(mockGetFinalDataAtomicValueWithNameInDatas).not.toHaveBeenCalled();
		});

		it('does not call extractAndSetChildren if dataGroup returned by getDataGroupWithNameInData is undefined', () => {
			mockGetDataGroupWithNameInDatas.mockReturnValueOnce(undefined);

			const extractAndSetChildrenSpy = jest.spyOn(des, 'extractAndSetChildren');

			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			des.extractAndSetChildren(someDefaultDataGroup, someMatcher);

			expect(extractAndSetChildrenSpy).toHaveBeenCalledTimes(1);
		});

		it('expect extractAndSetChildren to be called with dataGroup returned by getDataGroupWithNameInDatas and matcher set in matcher', () => {
			const dataGroupReturnedByGetDataGroupWithNameInDatas: DataGroup = {
				name: 'someFinalDataGroupName',
				children: [
					{
						name: 'someFinalName',
						value: 'someFinalValue',
					},
				],
			};

			const extractAndSetChildrenSpy = jest.spyOn(des, 'extractAndSetChildren');

			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			mockGetDataGroupWithNameInDatas.mockReturnValueOnce(
				dataGroupReturnedByGetDataGroupWithNameInDatas
			);
			des.extractAndSetChildren(someDefaultDataGroup, someMatcher);

			expect(extractAndSetChildrenSpy).toHaveBeenCalledTimes(2);
			expect(extractAndSetChildrenSpy).toHaveBeenNthCalledWith(
				2,
				dataGroupReturnedByGetDataGroupWithNameInDatas,
				someDefaultFinalMatcher
			);
		});

		it('calls possiblySetReturnValue with value from extractAndSetChildren, matcher.react, matcher.required, matcher.multiple, returns result', () => {
			const possiblySetReturnValueSpy = jest.spyOn(
				des,
				'possiblySetReturnValue'
			);

			const someMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			mockGetDataGroupWithNameInDatas.mockReturnValueOnce({
				name: 'someOtherDataGroup',
				children: [
					{
						name: 'someOtherDataAtomic',
						value: 'someFinalValue',
					},
				],
			});

			mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(
				'someFinalValue'
			);

			const returned = des.extractAndSetChildren(
				someDefaultDataGroup,
				someMatcher
			);

			expect(possiblySetReturnValueSpy).toHaveReturnedWith(returned);

			expect(possiblySetReturnValueSpy).toHaveBeenCalledWith(
				'someFinalValue',
				someDefaultFinalMatcher.react,
				someDefaultFinalMatcher.required,
				someDefaultFinalMatcher.multiple
			);

			const someFinalMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: false,
				required: true,
			};

			const someOtherMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someFinalMatcher,
			};

			mockGetDataGroupWithNameInDatas.mockReturnValueOnce({
				name: 'someOtherDataGroup',
				children: [
					{
						name: 'someOtherDataAtomic',
						value: 'someFinalValue',
					},
				],
			});

			mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(
				'someOtherFinalValue'
			);

			const returned2 = des.extractAndSetChildren(
				someDefaultDataGroup,
				someOtherMatcher
			);

			expect(possiblySetReturnValueSpy).toHaveBeenCalledWith(
				'someOtherFinalValue',
				someFinalMatcher.react,
				someFinalMatcher.required,
				someFinalMatcher.multiple
			);

			expect(possiblySetReturnValueSpy).toHaveReturnedWith(returned2);
		});

		it('if extractAndSetChildren returns !== undefined, should return object containing key: matcher.react and value: what extractAndSetChildren returns', () => {
			const someMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			mockGetDataGroupWithNameInDatas.mockReturnValueOnce({
				name: 'someOtherDataGroup',
				children: [
					{
						name: 'someOtherDataAtomic',
						value: 'someFinalValue',
					},
				],
			});

			mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(
				'someFinalValue'
			);

			const returned = des.extractAndSetChildren(
				someDefaultDataGroup,
				someMatcher
			);

			expect(returned).toStrictEqual({
				someFinalField: 'someFinalValue',
			});
		});

		it('if extractAndSetChildren returns === undefined, and field is required should return object containing key: matcher.react and value: ""', () => {
			const someFinalMatcher: Matcher = {
				react: 'someFinalField',
				cora: 'someOtherDataAtomic',
				required: true,
			};

			const someMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someFinalMatcher,
			};

			mockGetDataGroupWithNameInDatas.mockReturnValueOnce({
				name: 'someOtherDataGroup',
				children: [
					{
						name: 'someOtherDataAtomic',
						value: 'someFinalValue',
					},
				],
			});

			mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(undefined);

			const returned = des.extractAndSetChildren(
				someDefaultDataGroup,
				someMatcher
			);

			expect(returned).toStrictEqual({
				someFinalField: '',
			});
		});

		it('if extractAndSetChildren returns === undefined, and field is not required, should return undefined', () => {
			const someMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				matcher: someDefaultFinalMatcher,
			};

			mockGetDataGroupWithNameInDatas.mockReturnValueOnce({
				name: 'someOtherDataGroup',
				children: [
					{
						name: 'someOtherDataAtomic',
						value: 'someFinalValue',
					},
				],
			});

			mockGetFinalDataAtomicValueWithNameInDatas.mockReturnValueOnce(undefined);

			const returned = des.extractAndSetChildren(
				someDefaultDataGroup,
				someMatcher
			);

			expect(returned).toStrictEqual(undefined);
		});

		it('if getDataGroupWithNameInData returns undefined, return undefined', () => {
			const someMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
				matcher: someDefaultFinalMatcher,
			};
			mockGetDataGroupWithNameInDatas.mockReturnValueOnce(undefined);

			const returned = des.extractAndSetChildren(
				someDefaultDataGroup,
				someMatcher
			);

			expect(returned).toStrictEqual(undefined);
		});
		// it('if getDataGroupWithNameInData returns undefined, ')
	});

	describe('PathParser', () => {
		describe('getNameInDatasFromPath', () => {
			it('takes a string and returns an array', () => {
				const nameInDatas = des.getNameInDatasFromPath('');
				expect(nameInDatas).toStrictEqual([]);
			});
			it('returns an empty array if string is empty', () => {
				const nameInDatas = des.getNameInDatasFromPath('');
				expect(nameInDatas).toStrictEqual([]);
			});

			it('returns an array containing one string if string does not contain split-character', () => {
				const nameInDatas = des.getNameInDatasFromPath('id');
				expect(nameInDatas).toStrictEqual(['id']);
			});

			it('returns an array containing several string if string DOES contain split-character /', () => {
				const nameInDatas = des.getNameInDatasFromPath('recordinfo/id');
				expect(nameInDatas).toStrictEqual(['recordinfo', 'id']);
			});
		});
	});

	describe('possiblySetReturnValue', () => {
		it('takes value, fieldName, multiple and required', () => {
			des.possiblySetReturnValue('someValue', 'fieldName', true, true);
		});

		it('if value is undefined and required===false, return empty object', () => {
			const returned = des.possiblySetReturnValue(
				undefined,
				'fieldName',
				false,
				false
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
});
