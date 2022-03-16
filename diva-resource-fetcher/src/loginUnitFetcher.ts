import { getRecords, RecordType } from 'diva-cora-ts-api-wrapper';

const fetchLoginUnits = async () => {
	return new Promise((resolve, reject) => {
		getRecords(RecordType.LoginUnit)
			.then(() => {})
			.catch((error) => {
				reject(error);
			});
	});
};

export default fetchLoginUnits;
