import { RecordType } from '../../../types/Record';
import {
	dataListContainingFourPersons,
	dataListContainingOnePerson,
} from '../../../../testData/searchResults';
import convertToObjectWithRecordType from '../../../converter/RecordTypeConverter';
import { DataListWrapper } from '../../../cora-data/CoraData';
import extractListFromDataList from '../DataListHandler';
import { List } from '../../../types/List';

jest.mock('../../converter/RecordTypeConverter');
const mockConvertToObjectWithRecordType =
	convertToObjectWithRecordType as jest.MockedFunction<
		typeof convertToObjectWithRecordType
	>;

beforeAll(() => {
	mockConvertToObjectWithRecordType.mockReturnValue({
		id: 'someId',
		recordType: 'loginWebRedirect',
		url: 'someUrl',
	});
});

const dataListWithTwoRecords: DataListWrapper = {
	dataList: {
		containDataOfType: 'mix',
		data: [
			{
				record: {
					data: {
						name: 'someNameInData',
						children: [],
					},
				},
			},
			{
				record: {
					data: {
						name: 'someNameInData2',
						children: [],
					},
				},
			},
		],
		fromNo: '1',
		toNo: '2',
		totalNo: '2',
	},
};
const dataListWithThreeRecords: DataListWrapper = {
	dataList: {
		containDataOfType: 'mix',
		data: [
			{
				record: {
					data: {
						name: 'someNameInData',
						children: [],
					},
				},
			},
			{
				record: {
					data: {
						name: 'someNameInData2',
						children: [],
					},
				},
			},
			{
				record: {
					data: {
						name: 'someNameInData3',
						children: [],
					},
				},
			},
		],
		fromNo: '3',
		toNo: '6',
		totalNo: '3',
	},
};

describe('DataListHandler', () => {
	describe('extractListFromDataList', () => {
		it('takes DataListWrapper', () => {
			extractListFromDataList(
				dataListContainingOnePerson,
				RecordType.Person
			);
		});

		describe('if dataListWrapper does not contain elements', () => {
			it('does not call convertToObjectWithRecordType if dataListWrapper.dataList.data has no elements', () => {
				const emptyDataList: DataListWrapper = {
					dataList: {
						containDataOfType: 'mix',
						data: [],
						fromNo: '0',
						toNo: '-1',
						totalNo: '0',
					},
				};

				extractListFromDataList(emptyDataList, RecordType.Person);

				expect(
					mockConvertToObjectWithRecordType
				).not.toHaveBeenCalled();
			});
			it('returns List with empty data array and fromNo/toNo/totalNo from dataList', () => {
				const emptyDataList: DataListWrapper = {
					dataList: {
						containDataOfType: 'mix',
						data: [],
						fromNo: '0',
						toNo: '-1',
						totalNo: '0',
					},
				};

				let list = extractListFromDataList(
					emptyDataList,
					RecordType.Person
				);

				expect(list.data).toStrictEqual([]);
				expect(list.fromNumber).toStrictEqual(0);
				expect(list.toNumber).toStrictEqual(-1);
				expect(list.totalNumber).toStrictEqual(0);

				const emptyDataList2: DataListWrapper = {
					dataList: {
						containDataOfType: 'mix',
						data: [],
						fromNo: '123',
						toNo: '23',
						totalNo: '3',
					},
				};

				list = extractListFromDataList(
					emptyDataList2,
					RecordType.Person
				);

				expect(list.data).toStrictEqual([]);
				expect(list.fromNumber).toStrictEqual(123);
				expect(list.toNumber).toStrictEqual(23);
				expect(list.totalNumber).toStrictEqual(3);
			});
		});

		describe('if dataListWrapper contains elements', () => {
			it('does call convertToObjectWithRecordType with given recordType if dataListWrapper contains elements', () => {
				extractListFromDataList(
					dataListContainingOnePerson,
					RecordType.Person
				);

				expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(
					1
				);
				expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
					dataListContainingOnePerson.dataList.data[0].record.data,
					RecordType.Person
				);

				extractListFromDataList(
					dataListContainingOnePerson,
					RecordType.PersonDomainPart
				);

				expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(
					2
				);
				expect(mockConvertToObjectWithRecordType).toHaveBeenCalledWith(
					dataListContainingOnePerson.dataList.data[0].record.data,
					RecordType.PersonDomainPart
				);
			});

			it('does call convertToObjectWithRecordType for each record in dataList', () => {
				extractListFromDataList(
					dataListContainingFourPersons,
					RecordType.Person
				);

				expect(mockConvertToObjectWithRecordType).toHaveBeenCalledTimes(
					4
				);
				expect(
					mockConvertToObjectWithRecordType
				).toHaveBeenNthCalledWith(
					1,
					dataListContainingFourPersons.dataList.data[0].record.data,
					RecordType.Person
				);
				expect(
					mockConvertToObjectWithRecordType
				).toHaveBeenNthCalledWith(
					4,
					dataListContainingFourPersons.dataList.data[3].record.data,
					RecordType.Person
				);
			});

			it('returns a List containing the data returned from convertToObjectWithRecordType', () => {
				const record1 = {
					id: 'someId1',
					recordType: 'loginWebRedirect1',
					url: 'someUrl1',
				};
				const record2 = {
					id: 'someId2',
					recordType: 'loginWebRedirect2',
					url: 'someUrl2',
				};

				mockConvertToObjectWithRecordType.mockReturnValueOnce(record1);
				mockConvertToObjectWithRecordType.mockReturnValueOnce(record2);

				const list: List = extractListFromDataList(
					dataListWithTwoRecords,
					RecordType.Person
				);

				expect(list.data).toStrictEqual([record1, record2]);
			});

			it('returns a list with fromNumber, toNumber and totalNumber from dataList', () => {
				let list = extractListFromDataList(
					dataListWithTwoRecords,
					RecordType.Person
				);

				expect(list.fromNumber).toStrictEqual(1);
				expect(list.toNumber).toStrictEqual(2);
				expect(list.totalNumber).toStrictEqual(2);

				list = extractListFromDataList(
					dataListWithThreeRecords,
					RecordType.Person
				);

				expect(list.fromNumber).toStrictEqual(3);
				expect(list.toNumber).toStrictEqual(6);
				expect(list.totalNumber).toStrictEqual(3);
			});
		});
	});
});
