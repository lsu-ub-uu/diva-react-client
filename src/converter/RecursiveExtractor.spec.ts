import { DataGroup } from './CoraData';
import {
	extractDataGroupFollowingNameInDatas,
	getAllDataAtomicValuesWithNameInData,
	getFirstDataAtomicValueWithNameInData,
} from './CoraDataUtilsWrappers';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
} from './RecursiveExtractor';

jest.mock('./CoraDataUtilsWrappers');

const mockGetAllDataAtomicValuesWithNameInData =
	getAllDataAtomicValuesWithNameInData as jest.MockedFunction<
		typeof getAllDataAtomicValuesWithNameInData
	>;

const mockGetFirstDataAtomicValueWithNameInData =
	getFirstDataAtomicValueWithNameInData as jest.MockedFunction<
		typeof getFirstDataAtomicValueWithNameInData
	>;

jest.mock('./CoraDataUtils');

const mockExtractDataGroupFollowingNameInDatas =
	extractDataGroupFollowingNameInDatas as jest.MockedFunction<
		typeof extractDataGroupFollowingNameInDatas
	>;

const someEmptyDataGroup: DataGroup = {
	name: 'someEmptyDataGroup',
	children: [],
};

const someNonEmptyDataGroup: DataGroup = {
	name: 'someNonEmptyDataGroup',
	children: [
		{
			name: 'someChild',
			value: 'someValue',
		},
	],
};

const someNestedDataGroup: DataGroup = {
	name: 'someInterestingChildDataGroup',
	children: [
		{
			name: 'someAtomic',
			value: 'someAtomicValue',
		},
	],
};

const someTwoLevelDataGroup: DataGroup = {
	name: 'someDataGroup',
	children: [
		{
			name: 'someChildDataGroup',
			children: [],
		},
		someNestedDataGroup,
	],
};

beforeAll(() => {
	mockGetAllDataAtomicValuesWithNameInData.mockReturnValue([]);
	mockExtractDataGroupFollowingNameInDatas.mockReturnValue(
		someNonEmptyDataGroup
	);
});

describe('DataExtractor', () => {
	describe('extractAllDataAtomicValuesFollowingNameInDatas', () => {
		it('takes dataGroup, an array of nameInDatas', () => {
			extractAllDataAtomicValuesFollowingNameInDatas(someEmptyDataGroup, []);
		});

		it('if the array of nameInDatas is empty, returns an empty array', () => {
			const returned = extractAllDataAtomicValuesFollowingNameInDatas(
				someEmptyDataGroup,
				[]
			);

			expect(returned).toStrictEqual([]);
		});

		it('if the dataGroup does not contain any elements, returns an empty array', () => {
			const returned = extractAllDataAtomicValuesFollowingNameInDatas(
				someEmptyDataGroup,
				['someNameInData', 'someOtherNameInData']
			);

			expect(returned).toStrictEqual([]);
		});

		describe('if there are at least 2 nameInDatas in the array', () => {
			it('calls extractDataGroupFollowingNameInDatas with the dataGroup', () => {
				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					1
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					someNonEmptyDataGroup,
					expect.any(Array)
				);

				extractAllDataAtomicValuesFollowingNameInDatas(someTwoLevelDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					2
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					someTwoLevelDataGroup,
					expect.any(Array)
				);
			});

			it('calls extractDataGroupFollowingNameInDatas with all but the last nameInDatas', () => {
				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					1
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					expect.any(Object),
					['someNameInData']
				);

				extractAllDataAtomicValuesFollowingNameInDatas(someTwoLevelDataGroup, [
					'someNameInData',
					'someOtherNameInData',
					'someThirdNameInData',
					'someFourthNameInData',
					'someAtomicNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					2
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					expect.any(Object),
					[
						'someNameInData',
						'someOtherNameInData',
						'someThirdNameInData',
						'someFourthNameInData',
					]
				);
			});

			it('if extractDataGroupFollowingNameInDatas returns undefined, returns empty array', () => {
				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(undefined);

				expect(
					extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData', 'someOtherNameInData']
					)
				).toStrictEqual([]);
			});

			it('if extractDataGroupFollowingNameInDatas returns dataGroup, passes it to getAllDataAtomicValuesWithNameInData', () => {
				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(
					someNestedDataGroup
				);
				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledTimes(
					1
				);
				expect(
					mockGetAllDataAtomicValuesWithNameInData
				).toHaveBeenLastCalledWith(someNestedDataGroup, expect.any(String));

				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(
					someTwoLevelDataGroup
				);
				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledTimes(
					2
				);
				expect(
					mockGetAllDataAtomicValuesWithNameInData
				).toHaveBeenLastCalledWith(someTwoLevelDataGroup, expect.any(String));
			});

			it('if extractDataGroupFollowingNameInDatas returns dataGroup, passes last nameInData to getAllDataAtomicValuesWithNameInData', () => {
				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledTimes(
					1
				);
				expect(
					mockGetAllDataAtomicValuesWithNameInData
				).toHaveBeenLastCalledWith(expect.any(Object), 'someOtherNameInData');

				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
					'someThirdNameInData',
					'someFourthNameInData',
					'someAtomicNameInData',
				]);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledTimes(
					2
				);
				expect(
					mockGetAllDataAtomicValuesWithNameInData
				).toHaveBeenLastCalledWith(expect.any(Object), 'someAtomicNameInData');
			});

			it('returns whatever getAllDataAtomicValuesWithNameInData returns', () => {
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([]);

				expect(
					extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData', 'someOtherNameInData']
					)
				).toStrictEqual([]);

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someFoo',
					'someBar',
				]);

				expect(
					extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData', 'someOtherNameInData']
					)
				).toStrictEqual(['someFoo', 'someBar']);
			});
		});

		describe('if there is only one nameInData in the array', () => {
			it('calls getAllDataAtomicValuesWithNameInData with dataGroup and nameInData', () => {
				extractAllDataAtomicValuesFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
				]);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledWith(
					someNonEmptyDataGroup,
					'someNameInData'
				);

				const someOtherNonEmptyDataGroup: DataGroup = {
					name: 'someOtherNonEmptyDataGroup',
					children: [
						{
							name: 'someOtherChild',
							value: 'someOtherValue',
						},
					],
				};

				extractAllDataAtomicValuesFollowingNameInDatas(
					someOtherNonEmptyDataGroup,
					['someOtherNameInData']
				);

				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledWith(
					someOtherNonEmptyDataGroup,
					'someOtherNameInData'
				);
			});

			it('returns whatever getAllDataAtomicValuesWithNameInData is returning', () => {
				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([]);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData']
					)
				).toStrictEqual([]);

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someValue',
				]);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData']
					)
				).toStrictEqual(['someValue']);

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someValue',
					'someOtherValue',
				]);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData']
					)
				).toStrictEqual(['someValue', 'someOtherValue']);
			});
		});
	});

	describe('extractOneDataAtomicValueFollowingNameInDatas', () => {
		it('takes dataGroup, an array of nameInDatas', () => {
			extractOneDataAtomicValueFollowingNameInDatas(someEmptyDataGroup, []);
		});

		it('if the array of nameInDatas is empty, returns undefined', () => {
			const returned = extractOneDataAtomicValueFollowingNameInDatas(
				someEmptyDataGroup,
				[]
			);

			expect(returned).toStrictEqual(undefined);
		});

		it('if the dataGroup does not contain any elements, returns undefined', () => {
			const returned = extractOneDataAtomicValueFollowingNameInDatas(
				someEmptyDataGroup,
				['someNameInData', 'someOtherNameInData']
			);

			expect(returned).toStrictEqual(undefined);
		});

		describe('if there are at least 2 nameInDatas in the array', () => {
			it('calls extractDataGroupFollowingNameInDatas with the dataGroup', () => {
				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					1
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					someNonEmptyDataGroup,
					expect.any(Array)
				);

				extractOneDataAtomicValueFollowingNameInDatas(someTwoLevelDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					2
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					someTwoLevelDataGroup,
					expect.any(Array)
				);
			});

			it('calls extractDataGroupFollowingNameInDatas with all but the last nameInDatas', () => {
				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					1
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					expect.any(Object),
					['someNameInData']
				);

				extractOneDataAtomicValueFollowingNameInDatas(someTwoLevelDataGroup, [
					'someNameInData',
					'someOtherNameInData',
					'someThirdNameInData',
					'someFourthNameInData',
					'someAtomicNameInData',
				]);

				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledTimes(
					2
				);
				expect(mockExtractDataGroupFollowingNameInDatas).toHaveBeenCalledWith(
					expect.any(Object),
					[
						'someNameInData',
						'someOtherNameInData',
						'someThirdNameInData',
						'someFourthNameInData',
					]
				);
			});

			it('if extractDataGroupFollowingNameInDatas returns undefined, returns undefined', () => {
				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(undefined);

				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
						'someOtherNameInData',
					])
				).toStrictEqual(undefined);
			});

			it('if extractDataGroupFollowingNameInDatas returns dataGroup, passes it to getFirstDataAtomicValueWithNameInData', () => {
				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(
					someNestedDataGroup
				);
				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockGetFirstDataAtomicValueWithNameInData).toHaveBeenCalledTimes(
					1
				);
				expect(
					mockGetFirstDataAtomicValueWithNameInData
				).toHaveBeenLastCalledWith(someNestedDataGroup, expect.any(String));

				mockExtractDataGroupFollowingNameInDatas.mockReturnValueOnce(
					someTwoLevelDataGroup
				);
				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockGetFirstDataAtomicValueWithNameInData).toHaveBeenCalledTimes(
					2
				);
				expect(
					mockGetFirstDataAtomicValueWithNameInData
				).toHaveBeenLastCalledWith(someTwoLevelDataGroup, expect.any(String));
			});

			it('if extractDataGroupFollowingNameInDatas returns dataGroup, passes last nameInData to getFirstDataAtomicValueWithNameInData', () => {
				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
				]);

				expect(mockGetFirstDataAtomicValueWithNameInData).toHaveBeenCalledTimes(
					1
				);
				expect(
					mockGetFirstDataAtomicValueWithNameInData
				).toHaveBeenLastCalledWith(expect.any(Object), 'someOtherNameInData');

				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
					'someOtherNameInData',
					'someThirdNameInData',
					'someFourthNameInData',
					'someAtomicNameInData',
				]);

				expect(mockGetFirstDataAtomicValueWithNameInData).toHaveBeenCalledTimes(
					2
				);
				expect(
					mockGetFirstDataAtomicValueWithNameInData
				).toHaveBeenLastCalledWith(expect.any(Object), 'someAtomicNameInData');
			});

			it('returns whatever getFirstDataAtomicValueWithNameInData returns', () => {
				mockGetFirstDataAtomicValueWithNameInData.mockReturnValueOnce('');

				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
						'someOtherNameInData',
					])
				).toStrictEqual('');

				mockGetFirstDataAtomicValueWithNameInData.mockReturnValueOnce(
					'someFoo'
				);

				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
						'someOtherNameInData',
					])
				).toStrictEqual('someFoo');

				mockGetFirstDataAtomicValueWithNameInData.mockReturnValueOnce(
					undefined
				);

				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
						'someOtherNameInData',
					])
				).toStrictEqual(undefined);
			});
		});

		describe('if there is only one nameInData in the array', () => {
			it('calls getFirstDataAtomicValueWithNameInData with dataGroup and nameInData', () => {
				extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
					'someNameInData',
				]);

				expect(mockGetFirstDataAtomicValueWithNameInData).toHaveBeenCalledWith(
					someNonEmptyDataGroup,
					'someNameInData'
				);

				const someOtherNonEmptyDataGroup: DataGroup = {
					name: 'someOtherNonEmptyDataGroup',
					children: [
						{
							name: 'someOtherChild',
							value: 'someOtherValue',
						},
					],
				};

				extractOneDataAtomicValueFollowingNameInDatas(
					someOtherNonEmptyDataGroup,
					['someOtherNameInData']
				);

				expect(mockGetFirstDataAtomicValueWithNameInData).toHaveBeenCalledWith(
					someOtherNonEmptyDataGroup,
					'someOtherNameInData'
				);
			});

			it('returns whatever getFirstDataAtomicValueWithNameInData is returning', () => {
				mockGetFirstDataAtomicValueWithNameInData.mockReturnValueOnce('');
				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
					])
				).toStrictEqual('');

				mockGetFirstDataAtomicValueWithNameInData.mockReturnValueOnce(
					'someValue'
				);
				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
					])
				).toStrictEqual('someValue');

				mockGetFirstDataAtomicValueWithNameInData.mockReturnValueOnce(
					undefined
				);
				expect(
					extractOneDataAtomicValueFollowingNameInDatas(someNonEmptyDataGroup, [
						'someNameInData',
					])
				).toStrictEqual(undefined);
			});
		});
	});
});
