import { DataGroup } from '../cora-data/CoraData';
import { RecordType } from '../types/Record';
import convertToObject from './Converter';
import getMatcherForRecordType from './definitions';

const convertToObjectWithRecordType = <T>(
	dataGroup: DataGroup,
	recordType: RecordType
): T => {
	const matcher = getMatcherForRecordType(recordType);

	return convertToObject<T>(dataGroup, matcher);
};

export default convertToObjectWithRecordType;
