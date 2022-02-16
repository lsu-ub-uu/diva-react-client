import { DataGroup } from '../cora-data/CoraData';
import SupportedRecordType from '../types/RecordTypes';
import convertToObject from './Converter';
import getMatcherForRecordType from './definitions';

const convertToObjectWithRecordType = <T>(
	dataGroup: DataGroup,
	recordType: SupportedRecordType
): T => {
	const matcher = getMatcherForRecordType(recordType);

	return convertToObject<T>(dataGroup, matcher);
};

export default convertToObjectWithRecordType;
