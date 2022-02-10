import { DataGroup } from './CoraData';
import {
	getAllDataAtomicsWithNameInData,
	getFirstDataAtomicWithNameInData,
	getFirstDataGroupWithNameInData,
} from './CoraDataUtils';
import * as cduw from './CoraDataUtilsWrappers';

jest.mock('./CoraDataUtils');

const mockGetFirstDataAtomicWithNameInData =
	getFirstDataAtomicWithNameInData as jest.MockedFunction<
		typeof getFirstDataAtomicWithNameInData
	>;

const mockGetAllDataAtomicsWithNameInData =
	getAllDataAtomicsWithNameInData as jest.MockedFunction<
		typeof getAllDataAtomicsWithNameInData
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

	it("if getFirstDataAtomicWithNameInData returns dataAtomic, should return it's strin value", () => {
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
			'someAtomic',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			1,
			expect.any(Object),
			'someInterestingChildDataGroup'
		);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someOtherInterestingChildDataGroup',
			'someAtomic',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			3,
			expect.any(Object),
			'someOtherInterestingChildDataGroup'
		);
	});
	it('passes the dataGroup to getFirstDataGroupWithNameInData', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someFoo',
			'someAtomic',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			1,
			someNonEmptyDataGroup,
			expect.any(String)
		);

		cduw.extractDataGroupFollowingNameInDatas(someTwoLevelDataGroup, [
			'someFoo',
			'someAtomic',
		]);

		expect(mockGetFirstDataGroupWithNameInData).toHaveBeenNthCalledWith(
			3,
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

	describe('if there is only 1 nameInData', () => {
		it('does not call extractDataGroupFollowingNameInDatas again', () => {
			cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
				'someInterestingChildDataGroup',
			]);

			expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(1);
		});

		it('returns whatever getFirstDataGroupWithNameInData returns', () => {
			mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
				someNonEmptyDataGroup
			);

			expect(
				cduw.extractDataGroupFollowingNameInDatas(someTwoLevelDataGroup, [
					'someInterestingChildDataGroup',
				])
			).toStrictEqual(someNonEmptyDataGroup);

			mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(undefined);

			expect(
				cduw.extractDataGroupFollowingNameInDatas(someTwoLevelDataGroup, [
					'someInterestingChildDataGroup',
				])
			).toStrictEqual(undefined);
		});
	});

	it('if getFirstDataGroupWithNameInData returns DataGroup, passes it to extractDataGroupFollowingNameInDatas', () => {
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(
			someNonEmptyDataGroup
		);

		cduw.extractDataGroupFollowingNameInDatas(someTwoLevelDataGroup, [
			'someFoo',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(2);
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
	it('if getFirstDataGroupWithNameInData returns DataGroup, passes remaining array of nameInDatas to extractDataGroupFollowingNameInDatas', () => {
		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'someFoo',
			'someAtomic',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(2);
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
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenNthCalledWith(
			4,
			expect.any(Object),
			['someOtherNameInData', 'someThirdNameInData', 'someAtomic']
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
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(6);

		cduw.extractDataGroupFollowingNameInDatas(someNonEmptyDataGroup, [
			'one',
			'two',
			'three',
			'four',
		]);
		expect(extractDataGroupFollowingNameInDatasSpy).toHaveBeenCalledTimes(10);
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
		mockGetFirstDataGroupWithNameInData.mockReturnValueOnce(someFinalDataGroup);

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
