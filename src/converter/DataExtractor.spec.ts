import { DataGroup } from './CoraData';
import { getFirstDataGroupWithNameInData } from './CoraDataUtils';
import { getAllDataAtomicValuesWithNameInData } from './CoraDataUtilsWrappers';
import * as de from './DataExtractor';

jest.mock('./CoraDataUtilsWrappers');

const mockGetAllDataAtomicValuesWithNameInData =
	getAllDataAtomicValuesWithNameInData as jest.MockedFunction<
		typeof getAllDataAtomicValuesWithNameInData
	>;

jest.mock('./CoraDataUtils');

const mockGetFirstDataGroupWithNameInData =
	getFirstDataGroupWithNameInData as jest.MockedFunction<
		typeof getFirstDataGroupWithNameInData
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

const extractAllDataAtomicValuesFollowingNameInDatasSpy = jest.spyOn(
	de,
	'extractAllDataAtomicValuesFollowingNameInDatas'
);

beforeAll(() => {
	mockGetAllDataAtomicValuesWithNameInData.mockReturnValue([]);
	mockGetFirstDataGroupWithNameInData.mockReturnValue(someNonEmptyDataGroup);
});

describe('DataExtractor', () => {
	describe('getAllDataAtomicValuesWithNameInDatas', () => {
		it('takes dataGroup, an array of nameInDatas', () => {
			de.extractAllDataAtomicValuesFollowingNameInDatas(someEmptyDataGroup, []);
		});

		it('if the array of nameInDatas is empty, returns an empty array', () => {
			const returned = de.extractAllDataAtomicValuesFollowingNameInDatas(
				someEmptyDataGroup,
				[]
			);

			expect(returned).toStrictEqual([]);
		});

		it('if the dataGroup does not contain any elements, returns an empty array', () => {
			const returned = de.extractAllDataAtomicValuesFollowingNameInDatas(
				someEmptyDataGroup,
				['someNameInData', 'someOtherNameInData']
			);

			expect(returned).toStrictEqual([]);
		});

		describe('if there are at least 2 nameInDatas in the array', () => {
			it('passes the first of nameInDatas to getFirstDataGroupWithNameInData', () => {
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
					1,
					expect.any(Object),
					'someInterestingChildDataGroup'
				);

				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someOtherInterestingChildDataGroup', 'someAtomic']
				);

				expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
					2,
					expect.any(Object),
					'someOtherInterestingChildDataGroup'
				);
			});

			it('passes the dataGroup to getFirstDataGroupWithNameInData', () => {
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someFoo', 'someAtomic']
				);

				expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
					1,
					someNonEmptyDataGroup,
					expect.any(String)
				);

				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someFoo', 'someAtomic']
				);

				expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
					2,
					someTwoLevelDataGroup,
					expect.any(String)
				);
			});

			it('if getFirstDataGroupWithNameInData returns undefined, does not call extractAllDataAtomicValuesFollowingNameInDatas', () => {
				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(undefined);
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someFoo', 'someAtomic']
				);

				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenCalledTimes(1);
			});

			it('if getFirstDataGroupWithNameInData returns undefined, returns empty array', () => {
				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(undefined);

				expect(
					de.extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someFoo', 'someAtomic']
					)
				).toStrictEqual([]);
			});

			it('if getFirstDataGroupWithNameInData returns DataGroup, passes it to extractAllDataAtomicValuesFollowingNameInDatas', () => {
				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
					someNonEmptyDataGroup
				);

				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someFoo', 'someAtomic']
				);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenNthCalledWith(2, someNonEmptyDataGroup, expect.any(Array));

				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
					someTwoLevelDataGroup
				);

				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someFoo', 'someAtomic']
				);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenNthCalledWith(4, someTwoLevelDataGroup, expect.any(Array));
			});

			it('if getFirstDataGroupWithNameInData returns DataGroup, passes remaining array of nameInDatas to extractAllDataAtomicValuesFollowingNameInDatas', () => {
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someFoo', 'someAtomic']
				);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenNthCalledWith(2, expect.any(Object), ['someAtomic']);

				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					[
						'someNameInData',
						'someOtherNameInData',
						'someThirdNameInData',
						'someAtomic',
					]
				);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenNthCalledWith(4, expect.any(Object), [
					'someOtherNameInData',
					'someThirdNameInData',
					'someAtomic',
				]);
			});

			it('repeatedly calls extractAllDataAtomicValuesFollowingNameInDatas until only 1 nameInData is left', () => {
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['one', 'two', 'three', 'four', 'five', 'six']
				);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenCalledTimes(6);

				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['one', 'two', 'three', 'four']
				);
				expect(
					extractAllDataAtomicValuesFollowingNameInDatasSpy
				).toHaveBeenCalledTimes(10);
			});

			it('returns whatever extractAllDataAtomicValuesFollowingNameInDatas returns (in the end whatever getAllDataAtomicValuesWithNameInData returns)', () => {
				let returnedFromGetAllDataAtomicValuesWithNameInData = ['someValue'];

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce(
					returnedFromGetAllDataAtomicValuesWithNameInData
				);

				const atomicValues = de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(atomicValues).toStrictEqual(['someValue']);

				returnedFromGetAllDataAtomicValuesWithNameInData = [
					'someValue',
					'someOtherValue',
					'someThirdValue',
				];

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce(
					returnedFromGetAllDataAtomicValuesWithNameInData
				);

				const atomicValues2 = de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(atomicValues2).toStrictEqual(
					returnedFromGetAllDataAtomicValuesWithNameInData
				);
			});

			it('only calls getAllDataAtomicValuesWithNameInData once', () => {
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['one', 'two', 'three', 'four', 'five', 'six']
				);
				expect(mockGetAllDataAtomicValuesWithNameInData).toHaveBeenCalledTimes(
					1
				);
			});
		});

		describe('if there is only one nameInData in the array', () => {
			it('calls getAllDataAtomicValuesWithNameInData with dataGroup and nameInData', () => {
				de.extractAllDataAtomicValuesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someNameInData']
				);

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

				de.extractAllDataAtomicValuesFollowingNameInDatas(
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
					de.extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData']
					)
				).toStrictEqual([]);

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someValue',
				]);
				expect(
					de.extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData']
					)
				).toStrictEqual(['someValue']);

				mockGetAllDataAtomicValuesWithNameInData.mockReturnValueOnce([
					'someValue',
					'someOtherValue',
				]);
				expect(
					de.extractAllDataAtomicValuesFollowingNameInDatas(
						someNonEmptyDataGroup,
						['someNameInData']
					)
				).toStrictEqual(['someValue', 'someOtherValue']);
			});
		});
	});
});
