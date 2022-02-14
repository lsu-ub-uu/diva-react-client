import { FieldMatcher, Matcher } from './Converter';
import { DataGroup } from '../cora-data/CoraData';
import { extractDataGroupFollowingNameInDatas } from '../cora-data/CoraDataUtilsWrappers';
import * as des from './FieldMatcherExtractor';
import extractWithMatcher from './MatcherExtractor';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
} from './RecursiveExtractor';

jest.mock('./MatcherExtractor');
const mockExtractWithMatcher = extractWithMatcher as jest.MockedFunction<
	typeof extractWithMatcher
>;

jest.mock('./ElementSetter');

jest.mock('./RecursiveExtractor');

const mockExtractAllDataAtomicValuesFollowingNameInDatas =
	extractAllDataAtomicValuesFollowingNameInDatas as jest.MockedFunction<
		typeof extractAllDataAtomicValuesFollowingNameInDatas
	>;

const mockExtractOneDataAtomicValueFollowingNameInDatas =
	extractOneDataAtomicValueFollowingNameInDatas as jest.MockedFunction<
		typeof extractOneDataAtomicValueFollowingNameInDatas
	>;

jest.mock('../cora-data/CoraDataUtilsWrappers');
const mockExtractDataGroupFollowingNameInDatas =
	extractDataGroupFollowingNameInDatas as jest.MockedFunction<
		typeof extractDataGroupFollowingNameInDatas
	>;

const someEmptyDataGroup: DataGroup = {
	name: 'someEmptyDataGroup',
	children: [],
};

const defaultDataAtomicDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
	],
};

const defaultDataAtomicObjectMatcher: FieldMatcher = {
	propertyName: 'someAtomicName',
	nameInDataPath: 'someAtomicName',
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

const defaulMultipleDataAtomicObjectMatcher: FieldMatcher = {
	propertyName: 'someMultipleField',
	nameInDataPath: 'someMultipleAtomicNameInData',
	multiple: true,
};

beforeAll(() => {
	mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValue(
		'someDefaultValueFromGetFinalDataAtomicValueWithNameInDatas'
	);

	mockExtractDataGroupFollowingNameInDatas.mockReturnValue(someEmptyDataGroup);

	mockExtractAllDataAtomicValuesFollowingNameInDatas.mockReturnValue([
		'someDefaultValue',
		'someDefaultValue2',
	]);

	mockExtractWithMatcher.mockReturnValue({
		someDefaultKeyFromExtractWithMatcher:
			'someDefaultValueFromExtractWithMatcher',
	});
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

			const someMatcher: FieldMatcher = {
				propertyName: 'someField',
				nameInDataPath: 'someDataAtomic',
				multiple: true,
			};

			des.extractAndReturnChildren(someDataGroup, someMatcher);

			expect(getNameInDatasFromPathSpy).toHaveBeenLastCalledWith(
				someMatcher.nameInDataPath
			);

			const someOtherMatcher: FieldMatcher = {
				propertyName: 'someField',
				nameInDataPath: 'someDataGroup/someDataGroup/someDataAtomic',
				required: true,
			};

			des.extractAndReturnChildren(someDataGroup, someOtherMatcher);

			expect(getNameInDatasFromPathSpy).toHaveBeenLastCalledWith(
				someOtherMatcher.nameInDataPath
			);
		});

		describe('if not multiple', () => {
			it('calls extractOneDataAtomicValueFollowingNameInDatas with dataGroup, result from getNameInDatasFromPath and matcher', () => {
				des.extractAndReturnChildren(
					defaultDataAtomicDataGroup,
					defaultDataAtomicObjectMatcher
				);
				expect(
					mockExtractOneDataAtomicValueFollowingNameInDatas
				).toHaveBeenLastCalledWith(defaultDataAtomicDataGroup, [
					'someAtomicName',
				]);

				const someDataGroup: DataGroup = {
					name: 'someName',
					children: [],
				};

				const someOtherMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someDataGroup/someDataAtomic',
					required: true,
					attributesToMatch: { someKey: 'someValue' },
				};

				des.extractAndReturnChildren(someDataGroup, someOtherMatcher);

				expect(
					mockExtractOneDataAtomicValueFollowingNameInDatas
				).toHaveBeenLastCalledWith(someDataGroup, [
					'someDataGroup',
					'someDataGroup',
					'someDataAtomic',
				]);
			});

			it('returns value returned by extractOneDataAtomicValueFollowingNameInDatas', () => {
				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					'someFinalValue'
				);
				const returnedValue = des.extractAndReturnChildren(
					defaultDataAtomicDataGroup,
					defaultDataAtomicObjectMatcher
				);

				expect(returnedValue).toStrictEqual('someFinalValue');

				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					'someOtherValue'
				);
				const returnedValue2 = des.extractAndReturnChildren(
					defaultDataAtomicDataGroup,
					defaultDataAtomicObjectMatcher
				);

				expect(returnedValue2).toStrictEqual('someOtherValue');
			});

			it('adds value returned by extractOneDataAtomicValueFollowingNameInDatas to objectToSet with OTHER matcher.react as key', () => {
				const testObjectMatcher: FieldMatcher = {
					propertyName: 'someOtherAtomicName',
					nameInDataPath: 'someAtomicName',
				};
				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					'someValue'
				);
				const returnedValue = des.extractAndReturnChildren(
					defaultDataAtomicDataGroup,
					testObjectMatcher
				);

				expect(returnedValue).toStrictEqual('someValue');
			});
		});

		describe('if multiple', () => {
			it('does not call extractOneDataAtomicValueFollowingNameInDatas', () => {
				des.extractAndReturnChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);
				expect(
					mockExtractOneDataAtomicValueFollowingNameInDatas
				).not.toHaveBeenCalled();
			});

			it('does call getAllDataAtomicsWithNameInData with dataGroup and nameInData from getNameInDatasFromPath', () => {
				des.extractAndReturnChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);

				expect(
					mockExtractAllDataAtomicValuesFollowingNameInDatas
				).toHaveBeenCalledWith(defaultMultipleDataAtomicDataGroup, [
					defaulMultipleDataAtomicObjectMatcher.nameInDataPath,
				]);

				const multipleTestObjectMatcher: FieldMatcher = {
					propertyName: 'someMultipleField',
					nameInDataPath:
						'someDataGroupNameInData/someMultipleDataAtomicNameInData',
					multiple: true,
					attributesToMatch: { lang: 'en' },
				};

				des.extractAndReturnChildren(
					defaultMultipleDataAtomicDataGroup,
					multipleTestObjectMatcher
				);

				expect(
					mockExtractAllDataAtomicValuesFollowingNameInDatas
				).toHaveBeenCalledWith(defaultMultipleDataAtomicDataGroup, [
					'someDataGroupNameInData',
					'someMultipleDataAtomicNameInData',
				]);
			});

			it('returns value returned by getAllDataAtomicValuesWithNameInData', () => {
				const arrayToAdd = ['someAtomic', 'someOtherAtomic', 'someMore'];
				mockExtractAllDataAtomicValuesFollowingNameInDatas.mockReturnValueOnce([
					'someAtomic',
					'someOtherAtomic',
					'someMore',
				]);
				const returnedValue = des.extractAndReturnChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);

				expect(returnedValue).toStrictEqual(arrayToAdd);
			});
		});
	});

	describe('If a matcher was passed', () => {
		const someDefaultFinalFieldMatcher: FieldMatcher = {
			propertyName: 'someFinalField',
			nameInDataPath: 'someOtherDataAtomic',
		};
		const someDefaultFinalMatcher: Matcher = [someDefaultFinalFieldMatcher];

		const someDefaultDataGroup: DataGroup = {
			name: 'someName',
			children: [],
		};

		it('expect extractDataGroupFollowingNameInDatas to have been called with dataGroup, nameInDatas from getNameInDatasFromPath and attributesToMatch', () => {
			const someMatcher: FieldMatcher = {
				propertyName: 'someField',
				nameInDataPath: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				nextMatcher: someDefaultFinalMatcher,
			};

			des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

			expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenLastCalledWith(
				someDefaultDataGroup,
				['someDataGroup', 'someOtherDataGroup'],
				undefined
			);

			const someOtherMatcher: FieldMatcher = {
				propertyName: 'someField',
				nameInDataPath: 'someOtherDataGroup/someFinalDataGroup',
				nextMatcher: someDefaultFinalMatcher,
				attributesToMatch: { someKey: 'someValue' },
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

			des.extractAndReturnChildren(someOtherDataGroup, someOtherMatcher);

			expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenLastCalledWith(
				someOtherDataGroup,
				['someOtherDataGroup', 'someFinalDataGroup'],
				someOtherMatcher.attributesToMatch
			);
		});
		it('expect extractAllDataAtomicValuesFollowingNameInDatas and extractOneDataAtomicValueFollowingNameInDatas to not be called with input values', () => {
			const someMatcher: FieldMatcher = {
				propertyName: 'someField',
				nameInDataPath: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				nextMatcher: someDefaultFinalMatcher,
			};

			des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

			expect(
				mockExtractAllDataAtomicValuesFollowingNameInDatas
			).not.toHaveBeenCalled();

			expect(
				mockExtractOneDataAtomicValueFollowingNameInDatas
			).not.toHaveBeenCalledWith(someDefaultDataGroup, [
				'someDataGroup',
				'someOtherDataGroup',
			]);
		});

		describe('if multiple', () => {
			it.todo('calls extractAllDataGroupsFollowingNameInDatas');

			describe('if extractAllDataGroupsFollowingNameInDatas returns empty array', () => {
				it.todo('if property IS required, returns empty array');
				it.todo('if property is NOT required, returns undefined');
			});

			describe('if extractAllDataGroupsFollowingNameInDatas returns dataGroups', () => {
				it.todo('calls extractWithMatcher on each of them with nextMatcher');
				it.todo(
					'returns array containing results from all calls to extractWithMatcher'
				);
				it.todo(
					'if extractWithMatcher returns an empty object, that object is not included in the return array'
				);
				it.todo(
					'if extractWithMatcher returns an empty object, that object is not included in the return array'
				);
				it.todo(
					'if extractWithMatcher returns only empty objects, the required field of the parent matcher decides (see above)'
				);
			});
		});

		describe('if not multiple', () => {
			it('does not call extractWithMatcher if dataGroup returned by extractDataGroupFollowingNameInData is undefined', () => {
				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(undefined);

				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};

				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(mockExtractWithMatcher).not.toHaveBeenCalled();
			});

			it('expect extractWithMatcher to be called with dataGroup returned by extractDataGroupFollowingNameInDatas and nextMatcher set in matcher', () => {
				const dataGroupReturnedByGetDataGroupWithNameInDatas: DataGroup = {
					name: 'someFinalDataGroupName',
					children: [
						{
							name: 'someFinalName',
							value: 'someFinalValue',
						},
					],
				};

				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};

				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(
					dataGroupReturnedByGetDataGroupWithNameInDatas
				);
				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(mockExtractWithMatcher).toHaveBeenCalledTimes(1);
				expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
					1,
					dataGroupReturnedByGetDataGroupWithNameInDatas,
					someDefaultFinalMatcher
				);
			});

			it('returns whatever extractWithMatcher returns', () => {
				const someMatcherWithNextMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					nextMatcher: someDefaultFinalMatcher,
				};

				mockExtractWithMatcher.mockReturnValueOnce({
					someNiceKey: 'someNiceValue',
				});

				let returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someMatcherWithNextMatcher
				);

				expect(returned).toStrictEqual({
					someNiceKey: 'someNiceValue',
				});

				mockExtractWithMatcher.mockReturnValueOnce({
					someOtherKey: 'someOtherValue',
				});

				returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someMatcherWithNextMatcher
				);

				expect(returned).toStrictEqual({
					someOtherKey: 'someOtherValue',
				});
			});

			it('if extractDataGroupFollowingNameInDatas returns undefined, return undefined', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someInitialField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					nextMatcher: someDefaultFinalMatcher,
				};
				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(undefined);

				const returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someMatcher
				);

				expect(returned).toStrictEqual(undefined);
			});
		});
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
});
