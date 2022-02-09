import { DataGroup } from '../../src/converter/CoraData';
import {
	getAllDataAtomicsWithNameInData,
	getFirstDataAtomicWithNameInData,
} from '../../src/converter/CoraDataUtils';
import {
	getAllDataAtomicValuesWithNameInData,
	getFirstDataAtomicValueWithNameInData,
} from '../../src/converter/CoraDataUtilsWrappers';

jest.mock('../../src/converter/CoraDataUtils');

const mockGetFirstDataAtomicWithNameInData =
	getFirstDataAtomicWithNameInData as jest.MockedFunction<
		typeof getFirstDataAtomicWithNameInData
	>;

const mockGetAllDataAtomicsWithNameInData =
	getAllDataAtomicsWithNameInData as jest.MockedFunction<
		typeof getAllDataAtomicsWithNameInData
	>;

beforeAll(() => {
	mockGetFirstDataAtomicWithNameInData.mockReturnValue({
		name: 'someDefaultNameInData',
		value: 'someDefaultValue',
	});

	mockGetAllDataAtomicsWithNameInData.mockReturnValue([]);
});

const dataGroupWithEmptyChildren: DataGroup = {
	name: 'someName',
	children: [],
};

describe('getFirstDataAtomicValueWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		getFirstDataAtomicValueWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});

	it('should call getFirstDataAtomicWithNameInData with dataGroup and nameInData', () => {
		getFirstDataAtomicValueWithNameInData(
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

		getFirstDataAtomicValueWithNameInData(otherDataGroup, 'someOtherChildName');

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
			getFirstDataAtomicValueWithNameInData(
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
			getFirstDataAtomicValueWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toStrictEqual('someInterestingValue');

		mockGetFirstDataAtomicWithNameInData.mockReturnValueOnce({
			name: 'someChildName',
			value: 'someOtherInterestingValue',
		});

		expect(
			getFirstDataAtomicValueWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toStrictEqual('someOtherInterestingValue');
	});
});

describe('getAllDataAtomicValuesWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		getAllDataAtomicValuesWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});
	it('should call getAllDataAtomicsWithNameInData with dataGroup and nameInData', () => {
		getAllDataAtomicValuesWithNameInData(
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

		getAllDataAtomicValuesWithNameInData(otherDataGroup, 'someOtherChildName');

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
			getAllDataAtomicValuesWithNameInData(
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
			getAllDataAtomicValuesWithNameInData(
				dataGroupWithEmptyChildren,
				'someOtherChildName'
			)
		).toStrictEqual(['firstMatch', 'secondMatch', 'thirdMatch']);
	});
});
