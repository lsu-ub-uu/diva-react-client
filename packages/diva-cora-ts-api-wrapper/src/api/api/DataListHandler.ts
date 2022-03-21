import { RecordType, Record } from '../../types/Record';
import { DataListWrapper } from '../../cora-data/CoraData';
import convertToObjectWithRecordType from '../../converter/RecordTypeConverter';
import { List } from '../../types/List';

const extractListFromDataList = (
	dataListWrapper: DataListWrapper,
	recordType: RecordType
) => {
	let records: Record[] = [];
	if (dataListWrapper.dataList.data.length > 0) {
		records = dataListWrapper.dataList.data.map((recordWrapper) => {
			return convertToObjectWithRecordType(
				recordWrapper.record.data,
				recordType
			);
		});
	}
	const fromNumber = parseInt(dataListWrapper.dataList.fromNo, 10);
	const toNumber = parseInt(dataListWrapper.dataList.toNo, 10);
	const totalNumber = parseInt(dataListWrapper.dataList.totalNo, 10);
	return new List(records, fromNumber, toNumber, totalNumber);
};

export default extractListFromDataList;
