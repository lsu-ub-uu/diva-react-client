import { ConverterObject, FieldMatcher, Matcher } from '../Converter';
import { DataGroup } from '../../cora-data/CoraData';
import {
	extractAllDataGroupsWithAttributesFollowingNameInDatas,
	extractFirstDataGroupWithAttributesFollowingNameInDatas,
} from '../../cora-data/CoraDataUtilsWrappers';
import * as des from '../FieldMatcherExtractor';
import extractWithMatcher from '../MatcherExtractor';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
} from '../RecursiveExtractor';

jest.mock('../MatcherExtractor');
const mockExtractWithMatcher = extractWithMatcher as jest.MockedFunction<
	typeof extractWithMatcher
>;

jest.mock('../ElementSetter');

jest.mock('../RecursiveExtractor');

const mockExtractAllDataAtomicValuesFollowingNameInDatas =
	extractAllDataAtomicValuesFollowingNameInDatas as jest.MockedFunction<
		typeof extractAllDataAtomicValuesFollowingNameInDatas
	>;

const mockExtractOneDataAtomicValueFollowingNameInDatas =
	extractOneDataAtomicValueFollowingNameInDatas as jest.MockedFunction<
		typeof extractOneDataAtomicValueFollowingNameInDatas
	>;

jest.mock('../../cora-data/CoraDataUtilsWrappers');
const mockExtractFirstDataGroupWithAttributesFollowingNameInDatas =
	extractFirstDataGroupWithAttributesFollowingNameInDatas as jest.MockedFunction<
		typeof extractFirstDataGroupWithAttributesFollowingNameInDatas
	>;

const mockExtractAllDataGroupsWithAttributesFollowingNameInDatas =
	extractAllDataGroupsWithAttributesFollowingNameInDatas as jest.MockedFunction<
		typeof extractAllDataGroupsWithAttributesFollowingNameInDatas
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

	mockExtractFirstDataGroupWithAttributesFollowingNameInDatas.mockReturnValue(
		someEmptyDataGroup
	);

	mockExtractAllDataAtomicValuesFollowingNameInDatas.mockReturnValue([
		'someDefaultValue',
		'someDefaultValue2',
	]);

	mockExtractWithMatcher.mockReturnValue({
		someDefaultKeyFromExtractWithMatcher:
			'someDefaultValueFromExtractWithMatcher',
	});
});

describe('FieldMatcherExtractor', () => {
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
					nameInDataPath:
						'someDataGroup/someDataGroup/someDataAtomic',
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

			it('returns whatever extractOneDataAtomicValueFollowingNameInDatas returns', () => {
				const testObjectMatcher: FieldMatcher = {
					propertyName: 'someOtherAtomicName',
					nameInDataPath: 'someAtomicName',
				};
				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					'someValue'
				);
				let returnedValue = des.extractAndReturnChildren(
					defaultDataAtomicDataGroup,
					testObjectMatcher
				);

				expect(returnedValue).toStrictEqual('someValue');

				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					undefined
				);
				returnedValue = des.extractAndReturnChildren(
					defaultDataAtomicDataGroup,
					testObjectMatcher
				);

				expect(returnedValue).toStrictEqual(undefined);
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
				const arrayToAdd = [
					'someAtomic',
					'someOtherAtomic',
					'someMore',
				];
				mockExtractAllDataAtomicValuesFollowingNameInDatas.mockReturnValueOnce(
					['someAtomic', 'someOtherAtomic', 'someMore']
				);
				const returnedValue = des.extractAndReturnChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);

				expect(returnedValue).toStrictEqual(arrayToAdd);
			});

			it('if value returned by getAllDataAtomicValuesWithNameInData is empty, returns undefined', () => {
				mockExtractAllDataAtomicValuesFollowingNameInDatas.mockReturnValueOnce(
					[]
				);
				const returnedValue = des.extractAndReturnChildren(
					defaultMultipleDataAtomicDataGroup,
					defaulMultipleDataAtomicObjectMatcher
				);

				expect(returnedValue).toStrictEqual(undefined);
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

		const someDefaultMultipleMatcherWithAttributes: FieldMatcher = {
			propertyName: 'someField',
			nameInDataPath: 'someDataGroup/someOtherDataGroup',
			multiple: true,
			nextMatcher: someDefaultFinalMatcher,
			attributesToMatch: {
				someAttribute: 'someKey',
			},
		};

		describe('if not multiple', () => {
			it('expect extractFirstDataGroupWithAttributesFollowingNameInDatas to have been called with dataGroup, nameInDatas from getNameInDatasFromPath and attributesToMatch', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					nextMatcher: someDefaultFinalMatcher,
				};

				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(
					mockExtractFirstDataGroupWithAttributesFollowingNameInDatas
				).toHaveBeenLastCalledWith(
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

				des.extractAndReturnChildren(
					someOtherDataGroup,
					someOtherMatcher
				);

				expect(
					mockExtractFirstDataGroupWithAttributesFollowingNameInDatas
				).toHaveBeenLastCalledWith(
					someOtherDataGroup,
					['someOtherDataGroup', 'someFinalDataGroup'],
					someOtherMatcher.attributesToMatch
				);
			});
			it('expect extractAllDataAtomicValuesFollowingNameInDatas and extractOneDataAtomicValueFollowingNameInDatas to not be called with input values', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
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
		});
		describe('if multiple', () => {
			it('does not call extractFirstDataGroupWithAttributesFollowingNameInDatas', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};
				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(
					mockExtractFirstDataGroupWithAttributesFollowingNameInDatas
				).not.toHaveBeenCalled();
			});

			it('calls extractAllDataGroupsFollowingNameInDatas with dataGroup', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};
				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas
				).toHaveBeenNthCalledWith(
					1,
					someDefaultDataGroup,
					expect.any(Array),
					undefined
				);

				des.extractAndReturnChildren(someEmptyDataGroup, someMatcher);

				expect(
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas
				).toHaveBeenNthCalledWith(
					2,
					someEmptyDataGroup,
					expect.any(Array),
					undefined
				);
			});

			it('calls extractAllDataGroupsFollowingNameInDatas with nameInDatas', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};
				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas
				).toHaveBeenNthCalledWith(
					1,
					expect.any(Object),
					['someDataGroup', 'someOtherDataGroup'],
					undefined
				);

				const someOtherMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath:
						'someFirstDataGroup/someSecondDataGroup/someThird',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};
				des.extractAndReturnChildren(
					someDefaultDataGroup,
					someOtherMatcher
				);

				expect(
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas
				).toHaveBeenNthCalledWith(
					2,
					expect.any(Object),
					['someFirstDataGroup', 'someSecondDataGroup', 'someThird'],
					undefined
				);
			});

			it('calls extractAllDataGroupsFollowingNameInDatas with possible attributes', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
					attributesToMatch: {
						someAttribute: 'someKey',
					},
				};
				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas
				).toHaveBeenNthCalledWith(
					1,
					expect.any(Object),
					expect.any(Array),
					{
						someAttribute: 'someKey',
					}
				);

				const someOtherMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
					attributesToMatch: {
						someOtherAttribute: 'someOtherKey',
					},
				};
				des.extractAndReturnChildren(
					someDefaultDataGroup,
					someOtherMatcher
				);

				expect(
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas
				).toHaveBeenNthCalledWith(
					2,
					expect.any(Object),
					expect.any(Array),
					{
						someOtherAttribute: 'someOtherKey',
					}
				);
			});

			it('if extractAllDataGroupsFollowingNameInDatas returns empty array, returns undefined', () => {
				mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
					[]
				);
				const returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someDefaultMultipleMatcherWithAttributes
				);

				expect(returned).toBeUndefined();
			});

			it('if extractAllDataGroupsFollowingNameInDatas returns undefined, returns undefined', () => {
				mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
					undefined
				);
				const returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someDefaultMultipleMatcherWithAttributes
				);

				expect(returned).toBeUndefined();
			});

			describe('if extractAllDataGroupsFollowingNameInDatas returns dataGroups', () => {
				it('calls extractWithMatcher on each of them with nextMatcher', () => {
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[someDefaultDataGroup]
					);
					des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						1,
						expect.any(Object),
						someDefaultMultipleMatcherWithAttributes.nextMatcher
					);

					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[
							someDefaultDataGroup,
							someDefaultDataGroup,
							someDefaultDataGroup,
						]
					);
					des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(mockExtractWithMatcher).toHaveBeenCalledTimes(4);
					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						2,
						expect.any(Object),
						someDefaultMultipleMatcherWithAttributes.nextMatcher
					);
					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						4,
						expect.any(Object),
						someDefaultMultipleMatcherWithAttributes.nextMatcher
					);
				});
				it('calls extractWithMatcher with each of them', () => {
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[someDefaultDataGroup]
					);
					des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						1,
						someDefaultDataGroup,
						expect.any(Object)
					);

					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[
							someDefaultDataGroup,
							someEmptyDataGroup,
							someDefaultDataGroup,
						]
					);
					des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						2,
						someDefaultDataGroup,
						expect.any(Object)
					);
					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						3,
						someEmptyDataGroup,
						expect.any(Object)
					);
					expect(mockExtractWithMatcher).toHaveBeenNthCalledWith(
						4,
						someDefaultDataGroup,
						expect.any(Object)
					);
				});
				it('returns array containing results from all calls to extractWithMatcher', () => {
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[
							someDefaultDataGroup,
							someEmptyDataGroup,
							someDefaultDataGroup,
						]
					);

					const converterObjects: ConverterObject[] = [
						{
							someProperty: { someFoo: 'someBar' },
						},
						{
							someProperty2: { someFoo2: 'someBar2' },
						},
						{
							someProperty3: { someFoo3: 'someBar2' },
						},
					];

					converterObjects.forEach((obj) => {
						mockExtractWithMatcher.mockReturnValueOnce(obj);
					});

					const returned = des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(returned).toStrictEqual(converterObjects);
				});
				it('if extractWithMatcher returns an empty object, that object is not included in the return array', () => {
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[
							someDefaultDataGroup,
							someEmptyDataGroup,
							someDefaultDataGroup,
						]
					);

					const converterObjects: ConverterObject[] = [
						{
							someProperty: { someFoo: 'someBar' },
						},
						{},
						{
							someProperty3: { someFoo3: 'someBar2' },
						},
					];

					converterObjects.forEach((obj) => {
						mockExtractWithMatcher.mockReturnValueOnce(obj);
					});

					const returned = des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(returned).toStrictEqual([
						{
							someProperty: { someFoo: 'someBar' },
						},
						{
							someProperty3: { someFoo3: 'someBar2' },
						},
					]);
				});
				it('if extractWithMatcher returns only empty objects, an empty array is returned', () => {
					mockExtractAllDataGroupsWithAttributesFollowingNameInDatas.mockReturnValueOnce(
						[
							someDefaultDataGroup,
							someEmptyDataGroup,
							someDefaultDataGroup,
						]
					);

					const converterObjects: ConverterObject[] = [{}, {}, {}];

					converterObjects.forEach((obj) => {
						mockExtractWithMatcher.mockReturnValueOnce(obj);
					});

					const returned = des.extractAndReturnChildren(
						someDefaultDataGroup,
						someDefaultMultipleMatcherWithAttributes
					);

					expect(returned).toStrictEqual([]);
				});
			});
		});

		describe('if not multiple', () => {
			it('does not call extractWithMatcher if dataGroup returned by extractDataGroupFollowingNameInData is undefined', () => {
				mockExtractFirstDataGroupWithAttributesFollowingNameInDatas.mockReturnValueOnce(
					undefined
				);

				const someMatcher: FieldMatcher = {
					propertyName: 'someField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					nextMatcher: someDefaultFinalMatcher,
				};

				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(mockExtractWithMatcher).not.toHaveBeenCalled();
			});

			it('expect extractWithMatcher to be called with dataGroup returned by extractFirstDataGroupWithAttributesFollowingNameInDatas and nextMatcher set in matcher', () => {
				const dataGroupReturnedByGetDataGroupWithNameInDatas: DataGroup =
					{
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
					nextMatcher: someDefaultFinalMatcher,
				};

				mockExtractFirstDataGroupWithAttributesFollowingNameInDatas.mockReturnValueOnce(
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

			it('if extractFirstDataGroupWithAttributesFollowingNameInDatas returns undefined, return undefined', () => {
				const someMatcher: FieldMatcher = {
					propertyName: 'someInitialField',
					nameInDataPath: 'someDataGroup/someOtherDataGroup',
					nextMatcher: someDefaultFinalMatcher,
				};
				mockExtractFirstDataGroupWithAttributesFollowingNameInDatas.mockReturnValueOnce(
					undefined
				);

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
