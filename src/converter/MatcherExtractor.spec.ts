import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import { extractDataGroupFollowingNameInDatas } from './CoraDataUtilsWrappers';
import { possiblySetReturnValue } from './ElementSetter';
import * as des from './MatcherExtractor';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
} from './RecursiveExtractor';

jest.mock('./ElementSetter');

const mockPossiblySetReturnValue =
	possiblySetReturnValue as jest.MockedFunction<typeof possiblySetReturnValue>;

jest.mock('./DataAtomicConverter');

jest.mock('./RecursiveExtractor');

const mockExtractAllDataAtomicValuesFollowingNameInDatas =
	extractAllDataAtomicValuesFollowingNameInDatas as jest.MockedFunction<
		typeof extractAllDataAtomicValuesFollowingNameInDatas
	>;

const mockExtractOneDataAtomicValueFollowingNameInDatas =
	extractOneDataAtomicValueFollowingNameInDatas as jest.MockedFunction<
		typeof extractOneDataAtomicValueFollowingNameInDatas
	>;

jest.mock('./CoraDataUtilsWrappers');
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

beforeAll(() => {
	mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValue(
		'someDefaultValueFromGetFinalDataAtomicValueWithNameInDatas'
	);

	mockExtractDataGroupFollowingNameInDatas.mockReturnValue(someEmptyDataGroup);

	mockExtractAllDataAtomicValuesFollowingNameInDatas.mockReturnValue([
		'someDefaultValue',
		'someDefaultValue2',
	]);
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

			des.extractAndReturnChildren(someDataGroup, someMatcher);

			expect(getNameInDatasFromPathSpy).toHaveBeenLastCalledWith(
				someMatcher.cora
			);

			const someOtherMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someDataGroup/someDataAtomic',
				required: true,
			};

			des.extractAndReturnChildren(someDataGroup, someOtherMatcher);

			expect(getNameInDatasFromPathSpy).toHaveBeenLastCalledWith(
				someOtherMatcher.cora
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

				const someOtherMatcher: Matcher = {
					react: 'someField',
					cora: 'someDataGroup/someDataGroup/someDataAtomic',
					required: true,
					matchingAttributes: [{ key: 'someKey', value: 'someValue' }],
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

			it('adds value returned by extractDataAtomicValue to objectToSet with OTHER matcher.react as key', () => {
				const testObjectMatcher: Matcher = {
					react: 'someOtherAtomicName',
					cora: 'someAtomicName',
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
			it('does not call extractFirstDataAtomicWithNameInData', () => {
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
					defaulMultipleDataAtomicObjectMatcher.cora,
				]);

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
		const someDefaultFinalMatcher: Matcher = {
			react: 'someFinalField',
			cora: 'someOtherDataAtomic',
		};

		const someDefaultDataGroup: DataGroup = {
			name: 'someName',
			children: [],
		};

		it('expect extractDataGroupFollowingNameInDatas to have been called with dataGroup, nameInDatas from getNameInDatasFromPath and matchingAttributes', () => {
			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				nextMatcher: someDefaultFinalMatcher,
			};

			des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

			expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenLastCalledWith(
				someDefaultDataGroup,
				['someDataGroup', 'someOtherDataGroup'],
				undefined
			);

			const someOtherMatcher: Matcher = {
				react: 'someField',
				cora: 'someOtherDataGroup/someFinalDataGroup',
				nextMatcher: someDefaultFinalMatcher,
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

			des.extractAndReturnChildren(someOtherDataGroup, someOtherMatcher);

			expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenLastCalledWith(
				someOtherDataGroup,
				['someOtherDataGroup', 'someFinalDataGroup'],
				someOtherMatcher.matchingAttributes
			);
		});

		it('expect getAllDataAtomicValuesWithNameInData and extractOneDataAtomicValueFollowingNameInDatas to not be called with input values', () => {
			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
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

		it('does not call extractAndReturnChildren if dataGroup returned by getDataGroupWithNameInData is undefined', () => {
			mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(undefined);

			const extractAndReturnChildrenSpy = jest.spyOn(
				des,
				'extractAndReturnChildren'
			);

			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				nextMatcher: someDefaultFinalMatcher,
			};

			des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

			expect(extractAndReturnChildrenSpy).toHaveBeenCalledTimes(1);
		});

		it('expect extractAndReturnChildren to be called with dataGroup returned by extractDataGroupFollowingNameInDatas and matcher set in matcher', () => {
			const dataGroupReturnedByGetDataGroupWithNameInDatas: DataGroup = {
				name: 'someFinalDataGroupName',
				children: [
					{
						name: 'someFinalName',
						value: 'someFinalValue',
					},
				],
			};

			const extractAndReturnChildrenSpy = jest.spyOn(
				des,
				'extractAndReturnChildren'
			);

			const someMatcher: Matcher = {
				react: 'someField',
				cora: 'someDataGroup/someOtherDataGroup',
				multiple: true,
				nextMatcher: someDefaultFinalMatcher,
			};

			mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(
				dataGroupReturnedByGetDataGroupWithNameInDatas
			);
			des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

			expect(extractAndReturnChildrenSpy).toHaveBeenCalledTimes(2);
			expect(extractAndReturnChildrenSpy).toHaveBeenNthCalledWith(
				2,
				dataGroupReturnedByGetDataGroupWithNameInDatas,
				someDefaultFinalMatcher
			);
		});

		describe('calls possiblySetReturnValue', () => {
			it('calls possiblySetReturnValue with value from extractAndReturnChildren, matcher.react, matcher.required, matcher.multiple and returns result', () => {
				const someMatcher: Matcher = {
					react: 'someInitialField',
					cora: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};

				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce({
					name: 'someOtherDataGroup',
					children: [
						{
							name: 'someOtherDataAtomic',
							value: 'someFinalValue',
						},
					],
				});

				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					'someFinalValue'
				);

				des.extractAndReturnChildren(someDefaultDataGroup, someMatcher);

				expect(mockPossiblySetReturnValue).toHaveBeenCalledWith(
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
					nextMatcher: someFinalMatcher,
				};

				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce({
					name: 'someOtherDataGroup',
					children: [
						{
							name: 'someOtherDataAtomic',
							value: 'someFinalValue',
						},
					],
				});

				mockExtractOneDataAtomicValueFollowingNameInDatas.mockReturnValueOnce(
					'someOtherFinalValue'
				);

				des.extractAndReturnChildren(someDefaultDataGroup, someOtherMatcher);

				expect(mockPossiblySetReturnValue).toHaveBeenCalledWith(
					'someOtherFinalValue',
					someFinalMatcher.react,
					someFinalMatcher.required,
					someFinalMatcher.multiple
				);
			});

			it('returns what possiblySetReturnValue returns', () => {
				mockPossiblySetReturnValue.mockReturnValueOnce({});
				const someMatcher: Matcher = {
					react: 'someInitialField',
					cora: 'someDataGroup/someOtherDataGroup',
					multiple: true,
					nextMatcher: someDefaultFinalMatcher,
				};

				let returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someMatcher
				);

				expect(returned).toStrictEqual({});

				mockPossiblySetReturnValue.mockReturnValueOnce(undefined);

				returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someMatcher
				);

				expect(returned).toStrictEqual(undefined);

				mockPossiblySetReturnValue.mockReturnValueOnce({
					someMultiple: ['someString'],
				});

				returned = des.extractAndReturnChildren(
					someDefaultDataGroup,
					someMatcher
				);

				expect(returned).toStrictEqual({ someMultiple: ['someString'] });
			});
		});

		it('if extractDataGrouFollowingNameInDatas returns undefined, return undefined', () => {
			const someMatcher: Matcher = {
				react: 'someInitialField',
				cora: 'someDataGroup/someOtherDataGroup',
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
