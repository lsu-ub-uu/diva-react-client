import { DataGroup } from '../CoraData';
import {
	getAllDataAtomicsWithNameInData,
	getAllDataGroupsWithNameInDataAndAttributes,
	getFirstDataAtomicWithNameInData,
	getFirstDataGroupWithNameInData,
	getFirstDataGroupWithNameInDataAndAttribues,
} from '../CoraDataUtils';
import * as cduw from '../CoraDataUtilsWrappers';

jest.mock('../CoraDataUtils');

const mockGetFirstDataAtomicWithNameInData =
	getFirstDataAtomicWithNameInData as jest.MockedFunction<
		typeof getFirstDataAtomicWithNameInData
	>;

const mockGetAllDataAtomicsWithNameInData =
	getAllDataAtomicsWithNameInData as jest.MockedFunction<
		typeof getAllDataAtomicsWithNameInData
	>;

const mockGetFirstDataGroupWithNameInDataAndAttributes =
	getFirstDataGroupWithNameInDataAndAttribues as jest.MockedFunction<
		typeof getFirstDataGroupWithNameInDataAndAttribues
	>;

const mockGetAllDataGroupsWithNameInDataAndAttributes =
	getAllDataGroupsWithNameInDataAndAttributes as jest.MockedFunction<
		typeof getAllDataGroupsWithNameInDataAndAttributes
	>;

const mockGetFirstDataGroupWithNameInData =
	getFirstDataGroupWithNameInData as jest.MockedFunction<
		typeof getFirstDataGroupWithNameInData
	>;

const extractDataGroupFollowingNameInDatasSpy = jest.spyOn(
	cduw,
	'extractDataGroupFollowingNameInDatas'
);

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
	mockGetFirstDataAtomicWithNameInData.mockReturnValue({
		name: 'someDefaultNameInData',
		value: 'someDefaultValue',
	});

	mockGetAllDataAtomicsWithNameInData.mockReturnValue([]);

	mockGetFirstDataGroupWithNameInDataAndAttributes.mockReturnValue(
		someNonEmptyDataGroup
	);

	mockGetFirstDataGroupWithNameInData.mockReturnValue(someNonEmptyDataGroup);
});

const dataGroupWithEmptyChildren: DataGroup = {
	name: 'someName',
	children: [],
};

describe('getFirstDataAtomicValueWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		cduw.getFirstDataAtomicValueWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});

	it('should call getFirstDataAtomicWithNameInData with dataGroup and nameInData', () => {
		cduw.getFirstDataAtomicValueWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);

		expect(mockGetFirstDataAtomicWithNameInData).toHaveBeenCalled();
		expect(mockGetFirstDataAtomicWithNameInData).toHaveBeenCalledWith(
			dataGroupWithEmptyChildren,
			'someChildName'
		);

		const otherDataGroup: DataGroup = {
			name: 'someOtherName',
			children: [{ name: 'someName', value: 'someValue' }],
		};

		cduw.getFirstDataAtomicValueWithNameInData(
			otherDataGroup,
			'someOtherChildName'
		);

		expect(mockGetFirstDataAtomicWithNameInData).toHaveBeenCalledTimes(2);
		expect(mockGetFirstDataAtomicWithNameInData).toHaveBeenNthCalledWith(
			2,
			otherDataGroup,
			'someOtherChildName'
		);
	});

	it('should return undefined, if getFirstDataAtomicWithNameInData returns undefined', () => {
		mockGetFirstDataAtomicWithNameInData.mockReturnValueOnce(undefined);

		expect(
			cduw.getFirstDataAtomicValueWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toBeUndefined();
	});

	it("if getFirstDataAtomicWithNameInData returns dataAtomic, should return it's string value", () => {
		mockGetFirstDataAtomicWithNameInData.mockReturnValueOnce({
			name: 'someChildName',
			value: 'someInterestingValue',
		});

		expect(
			cduw.getFirstDataAtomicValueWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toStrictEqual('someInterestingValue');

		mockGetFirstDataAtomicWithNameInData.mockReturnValueOnce({
			name: 'someChildName',
			value: 'someOtherInterestingValue',
		});

		expect(
			cduw.getFirstDataAtomicValueWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toStrictEqual('someOtherInterestingValue');
	});
});

describe('getAllDataAtomicValuesWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		cduw.getAllDataAtomicValuesWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});
	it('should call getAllDataAtomicsWithNameInData with dataGroup and nameInData', () => {
		cduw.getAllDataAtomicValuesWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);

		expect(mockGetAllDataAtomicsWithNameInData).toHaveBeenCalled();
		expect(mockGetAllDataAtomicsWithNameInData).toHaveBeenCalledWith(
			dataGroupWithEmptyChildren,
			'someChildName'
		);

		const otherDataGroup: DataGroup = {
			name: 'someOtherName',
			children: [{ name: 'someName', value: 'someValue' }],
		};

		cduw.getAllDataAtomicValuesWithNameInData(
			otherDataGroup,
			'someOtherChildName'
		);

		expect(mockGetAllDataAtomicsWithNameInData).toHaveBeenCalledTimes(2);
		expect(mockGetAllDataAtomicsWithNameInData).toHaveBeenNthCalledWith(
			2,
			otherDataGroup,
			'someOtherChildName'
		);
	});
	it('should return empty array, if getAllDataAtomicsWithNameInData returns empty array', () => {
		mockGetAllDataAtomicsWithNameInData.mockReturnValueOnce([]);
		expect(
			cduw.getAllDataAtomicValuesWithNameInData(
				dataGroupWithEmptyChildren,
				'someOtherChildName'
			)
		).toStrictEqual([]);
	});
	it('if getAllDataAtomicsWithNameInData returns dataAtomic, should return their string value in an array', () => {
		mockGetAllDataAtomicsWithNameInData.mockReturnValueOnce([
			{ name: 'someName', value: 'firstMatch' },
			{ name: 'someName', value: 'secondMatch' },
			{ name: 'someName', value: 'thirdMatch' },
		]);
		expect(
			cduw.getAllDataAtomicValuesWithNameInData(
				dataGroupWithEmptyChildren,
				'someOtherChildName'
			)
		).toStrictEqual(['firstMatch', 'secondMatch', 'thirdMatch']);
	});
});

describe('extractDataGroupFollowingNameInDatas', () => {
	it('if nameInDatas.length=== 0, return undefined', () => {
		expect(
			cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [])
		).toBeUndefined();
	});

	it('if dataGroup has no children, return undefined', () => {
		expect(
			cduw.extractDataGroupFollowingNameInDatas(someEmptyDataGroup, [
				'someNameInData',
			])
		).toBeUndefined();
	});

	it('passes the first of nameInDatas to getFirstDataGroupWithNameInData', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someInterestingChildDataGroup',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			1,
			expect.any(Object),
			'someInterestingChildDataGroup'
		);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someOtherInterestingChildDataGroup',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			2,
			expect.any(Object),
			'someOtherInterestingChildDataGroup'
		);
	});
	it('passes the dataGroup to getFirstDataGroupWithNameInData', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someFoo',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			1,
			someNonEmptyDataGroup,
			expect.any(String)
		);

		cduw.extractDataGroupFollowingNameInDatas(someTwoLevelDataGroup, [
			'someFoo',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			2,
			someTwoLevelDataGroup,
			expect.any(String)
		);
	});
	it('if getFirstDataGroupWithNameInData returns undefined, returns undefined', () => {
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(undefined);

		expect(
			cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
				'someFoo',
				'someAtomic',
			])
		).toStrictEqual(undefined);
	});
	it('does recursively call extractDataGroupFollowingNameInDatas once for each nameInData', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someNameInData',
			'someOtherNameInData',
			'someThirdNameInData',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			4
		);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someNameInData',
			'someOtherNameInData',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			6
		);
	});

	it('if getFirstDataGroupWithNameInData returns DataGroup, passes remaining array of nameInDatas to extractDataGroupFollowingNameInDatas', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someFoo',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			2
		);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenNthCalledWith(
			2,
			expect.any(Object),
			['someAtomic']
		);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someNameInData',
			'someOtherNameInData',
			'someThirdNameInData',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			6
		);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenNthCalledWith(
			4,
			expect.any(Object),
			['someOtherNameInData', 'someThirdNameInData', 'someAtomic']
		);
	});

	it('if getFirstDataGroupWithNameInData returns DataGroup, passes it to extractDataGroupFollowingNameInDatas', () => {
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someNonEmptyDataGroup
		);

		cduw.extractDataGroupFollowingNameInDatas(someTwoLevelDataGroup, [
			'someFoo',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			2
		);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenNthCalledWith(
			1,
			someTwoLevelDataGroup,
			expect.any(Array)
		);

		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenNthCalledWith(
			2,
			someNonEmptyDataGroup,
			expect.any(Array)
		);

		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someTwoLevelDataGroup
		);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someFoo',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenNthCalledWith(
			4,
			someTwoLevelDataGroup,
			expect.any(Array)
		);
	});

	it('repeatedly calls extractDataGroupFollowingNameInDatas until no nameInData is left', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'one',
			'two',
			'three',
			'four',
			'five',
			'six',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			6
		);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'one',
			'two',
			'three',
			'four',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(
			10
		);
	});
	it('returns whatever extractDataGroupFollowingNameInDatas returns last', () => {
		const someFinalDataGroup: DataGroup = {
			name: 'someFinalDataGroup',
			children: [
				{
					name: 'someFinalAtomic',
					value: 'someFinalValue',
				},
			],
		};
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someNonEmptyDataGroup
		);
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someFinalDataGroup
		);

		const returnedDataGroup = cduw.extractDataGroupFollowingNameInDatas(
			someNonEmptyDataGroup,
			['someInterestingChildDataGroup', 'someAtomic']
		);

		expect(returnedDataGroup).toStrictEqual(someFinalDataGroup);

		const someOtherFinalDataGroup: DataGroup = {
			name: 'someOtherFinalDataGroup',
			children: [
				{
					name: 'someOtherFinalAtomic',
					value: 'someOtherFinalValue',
				},
			],
		};

		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someNonEmptyDataGroup
		);
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someNonEmptyDataGroup
		);
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someOtherFinalDataGroup
		);

		const returnedDataGroup2 = cduw.extractDataGroupFollowingNameInDatas(
			someNonEmptyDataGroup,
			['someInterestingChildDataGroup', 'someOtherChild', 'someAtomic']
		);

		expect(returnedDataGroup2).toStrictEqual(someOtherFinalDataGroup);
	});
});

describe('extractFirstDataGroupWithAttributesFollowingNameInDatas', () => {
	it('if nameInDatas.length=== 0, return undefined', () => {
		expect(
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				[]
			)
		).toBeUndefined();
	});

	it('if dataGroup has no children, return undefined', () => {
		expect(
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someEmptyDataGroup,
				['someNameInData']
			)
		).toBeUndefined();
	});

	describe('if there are at least 2 nameInDatas', () => {
		it('passes all but the last nameInData to extractDataGroupFollowingNameInDatas', () => {
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup', 'someAtomic']
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(1, expect.any(Object), [
				'someInterestingChildDataGroup',
			]);

			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				[
					'someInterestingChildDataGroup',
					'someOtherInterestingChildDataGroup',
					'someThirdInterestingChildDataGroup',
					'someAtomic',
				]
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(2, expect.any(Object), [
				'someInterestingChildDataGroup',
				'someOtherInterestingChildDataGroup',
				'someThirdInterestingChildDataGroup',
			]);
		});
		it('passes the dataGroup to extractDataGroupFollowingNameInDatas', () => {
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup', 'someAtomic']
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(
				1,
				someNonEmptyDataGroup,
				expect.any(Array)
			);

			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someTwoLevelDataGroup,
				[
					'someInterestingChildDataGroup',
					'someOtherInterestingChildDataGroup',
				]
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(
				2,
				someTwoLevelDataGroup,
				expect.any(Array)
			);
		});
		it('if extractDataGroupFollowingNameInDatas returns undefined, return undefined', () => {
			mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(undefined);
			const returned =
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

			expect(returned).toBeUndefined();
		});

		describe('if extractDataGroupFollowingNameInDatas returns dataGroup', () => {
			it('call getFirstDataGroupWithNameInDataAndAttributes with that dataGroup', () => {
				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
					someNestedDataGroup
				);
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(
					mockGetFirstDataGroupWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					someNestedDataGroup,
					expect.any(String),
					undefined
				);

				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
					someNonEmptyDataGroup
				);
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(
					mockGetFirstDataGroupWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					someNonEmptyDataGroup,
					expect.any(String),
					undefined
				);
			});
			it('call getFirstDataGroupWithNameInDataAndAttributes with the remaining nameInData', () => {
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					[
						'someInterestingChildDataGroup',
						'someOtherInterestingChildDataGroup',
						'someFinalDataGroup',
					]
				);

				expect(
					mockGetFirstDataGroupWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					'someFinalDataGroup',
					undefined
				);

				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someOtherFinalDataGroup']
				);

				expect(
					mockGetFirstDataGroupWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					'someOtherFinalDataGroup',
					undefined
				);
			});
			it('call getFirstDataGroupWithNameInDataAndAttributes with possible attributes', () => {
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someFinalDataGroup'],
					{
						someAttribute: 'foo',
						someOtherAttribute: 'bar',
					}
				);

				expect(
					mockGetFirstDataGroupWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					expect.any(String),
					{
						someAttribute: 'foo',
						someOtherAttribute: 'bar',
					}
				);

				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					[
						'someInterestingChildDataGroup',
						'someOtherFinalDataGroup',
					],
					{
						bar: 'foo',
					}
				);

				expect(
					mockGetFirstDataGroupWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					expect.any(String),
					{
						bar: 'foo',
					}
				);
			});
			it('returns whatever getFirstDataGroupWithNameInDataAndAttributes returns', () => {
				mockGetFirstDataGroupWithNameInDataAndAttributes.mockReturnValueOnce(
					someNestedDataGroup
				);
				let returned =
					cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
						someTwoLevelDataGroup,
						['someInterestingChildDataGroup', 'someAtomic']
					);

				expect(returned).toStrictEqual(someNestedDataGroup);

				mockGetFirstDataGroupWithNameInDataAndAttributes.mockReturnValueOnce(
					someTwoLevelDataGroup
				);
				returned =
					cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
						someTwoLevelDataGroup,
						['someInterestingChildDataGroup', 'someAtomic']
					);

				expect(returned).toStrictEqual(someTwoLevelDataGroup);
			});
		});
	});

	describe('if there is only 1 nameInData', () => {
		it('does not call extractDataGroupFollowingNameInDatas', () => {
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup']
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).not.toHaveBeenCalled();
		});

		it('does not call getFirstDataGroupWithNameInData', () => {
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup']
			);

			expect(mockGetFirstDataGroupWithNameInData).not.toHaveBeenCalled();
		});

		it('calls getFirstDataGroupWithNameInDataAndAttributes', () => {
			cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
				someTwoLevelDataGroup,
				['someInterestingChildDataGroup'],
				{
					someAttribute: 'foo',
				}
			);

			expect(
				mockGetFirstDataGroupWithNameInDataAndAttributes
			).toHaveBeenCalledWith(
				someTwoLevelDataGroup,
				'someInterestingChildDataGroup',
				{
					someAttribute: 'foo',
				}
			);
		});

		it('returns whatever getFirstDataGroupWithNameInDataAndAttributes returns', () => {
			mockGetFirstDataGroupWithNameInDataAndAttributes.mockReturnValueOnce(
				someTwoLevelDataGroup
			);

			expect(
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup']
				)
			).toStrictEqual(someTwoLevelDataGroup);

			mockGetFirstDataGroupWithNameInDataAndAttributes.mockReturnValueOnce(
				undefined
			);

			expect(
				cduw.extractFirstDataGroupWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup']
				)
			).toStrictEqual(undefined);
		});
	});
});

describe('extractAllDataGroupsWithAttributesFollowingNameInDatas', () => {
	it('if nameInDatas.length=== 0, return undefined', () => {
		expect(
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				[]
			)
		).toBeUndefined();
	});

	it('if dataGroup has no children, return undefined', () => {
		expect(
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someEmptyDataGroup,
				['someNameInData']
			)
		).toBeUndefined();
	});

	describe('if there are at least 2 nameInDatas', () => {
		it('passes all but the last nameInData to extractDataGroupFollowingNameInDatas', () => {
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup', 'someAtomic']
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(1, expect.any(Object), [
				'someInterestingChildDataGroup',
			]);

			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				[
					'someInterestingChildDataGroup',
					'someOtherInterestingChildDataGroup',
					'someThirdInterestingChildDataGroup',
					'someAtomic',
				]
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(2, expect.any(Object), [
				'someInterestingChildDataGroup',
				'someOtherInterestingChildDataGroup',
				'someThirdInterestingChildDataGroup',
			]);
		});
		it('passes the dataGroup to extractDataGroupFollowingNameInDatas', () => {
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup', 'someAtomic']
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(
				1,
				someNonEmptyDataGroup,
				expect.any(Array)
			);

			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someTwoLevelDataGroup,
				[
					'someInterestingChildDataGroup',
					'someOtherInterestingChildDataGroup',
				]
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).toHaveBeenNthCalledWith(
				2,
				someTwoLevelDataGroup,
				expect.any(Array)
			);
		});
		it('if extractDataGroupFollowingNameInDatas returns undefined, return undefined', () => {
			mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(undefined);
			const returned =
				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someNonEmptyDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

			expect(returned).toBeUndefined();
		});

		describe('if extractDataGroupFollowingNameInDatas returns dataGroup', () => {
			it('call getAllDataGroupsWithNameInDataAndAttributes with that dataGroup', () => {
				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
					someTwoLevelDataGroup
				);

				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(
					mockGetAllDataGroupsWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					someTwoLevelDataGroup,
					expect.any(String),
					undefined
				);

				mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
					someNonEmptyDataGroup
				);
				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someAtomic']
				);

				expect(
					mockGetAllDataGroupsWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					someNonEmptyDataGroup,
					expect.any(String),
					undefined
				);
			});
			it('call getAllDataGroupsWithNameInDataAndAttributes with the remaining nameInData', () => {
				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					[
						'someInterestingChildDataGroup',
						'someOtherInterestingChildDataGroup',
						'someFinalDataGroup',
					]
				);

				expect(
					mockGetAllDataGroupsWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					'someFinalDataGroup',
					undefined
				);

				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someOtherFinalDataGroup']
				);

				expect(
					mockGetAllDataGroupsWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					'someOtherFinalDataGroup',
					undefined
				);
			});
			it('call getAllDataGroupsWithNameInDataAndAttributes with possible attributes', () => {
				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup', 'someFinalDataGroup'],
					{
						someAttribute: 'foo',
						someOtherAttribute: 'bar',
					}
				);

				expect(
					mockGetAllDataGroupsWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					expect.any(String),
					{
						someAttribute: 'foo',
						someOtherAttribute: 'bar',
					}
				);

				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					[
						'someInterestingChildDataGroup',
						'someOtherFinalDataGroup',
					],
					{
						bar: 'foo',
					}
				);

				expect(
					mockGetAllDataGroupsWithNameInDataAndAttributes
				).toHaveBeenLastCalledWith(
					expect.any(Object),
					expect.any(String),
					{
						bar: 'foo',
					}
				);
			});
			it('returns whatever getAllDataGroupsWithNameInDataAndAttributes returns', () => {
				mockGetAllDataGroupsWithNameInDataAndAttributes.mockReturnValueOnce(
					[]
				);
				let returned =
					cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
						someTwoLevelDataGroup,
						['someInterestingChildDataGroup', 'someAtomic']
					);

				expect(returned).toStrictEqual([]);

				mockGetAllDataGroupsWithNameInDataAndAttributes.mockReturnValueOnce(
					[someTwoLevelDataGroup, someNonEmptyDataGroup]
				);
				returned =
					cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
						someTwoLevelDataGroup,
						['someInterestingChildDataGroup', 'someAtomic']
					);

				expect(returned).toStrictEqual([
					someTwoLevelDataGroup,
					someNonEmptyDataGroup,
				]);
			});
		});
	});

	describe('if there is only 1 nameInData', () => {
		it('does not call extractDataGroupFollowingNameInDatas', () => {
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup']
			);

			expect(
				extractDataGroupFollowingNameInDatasSpy
			).not.toHaveBeenCalled();
		});

		it('does not call getFirstDataGroupWithNameInData', () => {
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someNonEmptyDataGroup,
				['someInterestingChildDataGroup']
			);

			expect(mockGetFirstDataGroupWithNameInData).not.toHaveBeenCalled();
		});

		it('calls getAllDataGroupsWithNameInDataAndAttributes', () => {
			cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
				someTwoLevelDataGroup,
				['someInterestingChildDataGroup'],
				{
					someAttribute: 'foo',
				}
			);

			expect(
				mockGetAllDataGroupsWithNameInDataAndAttributes
			).toHaveBeenCalledWith(
				someTwoLevelDataGroup,
				'someInterestingChildDataGroup',
				{
					someAttribute: 'foo',
				}
			);
		});

		it('returns whatever getFirstDataGroupWithNameInDataAndAttributes returns', () => {
			mockGetAllDataGroupsWithNameInDataAndAttributes.mockReturnValueOnce(
				[someTwoLevelDataGroup]
			);

			expect(
				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup']
				)
			).toStrictEqual([someTwoLevelDataGroup]);

			mockGetAllDataGroupsWithNameInDataAndAttributes.mockReturnValueOnce(
				[]
			);

			expect(
				cduw.extractAllDataGroupsWithAttributesFollowingNameInDatas(
					someTwoLevelDataGroup,
					['someInterestingChildDataGroup']
				)
			).toStrictEqual([]);
		});
	});
});
