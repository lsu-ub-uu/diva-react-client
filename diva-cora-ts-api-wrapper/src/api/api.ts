import { RecordWrapper } from '../cora-data/CoraData';
import httpClient from './http/HttpClient';
import { IHttpClientRequestParameters } from './http/IHttpClient';
import convertToObjectWithRecordType from '../converter/RecordTypeConverter';
import { RecordType } from '../types/Record';

export function getRecordById<T>(
	recordType: RecordType,
	id: string
): Promise<T> {
	return new Promise((resolve, reject) => {
		if (id === '') {
			reject(
				new Error(
					`getRecordById was called with recordType ${recordType} but no id.`
				)
			);
		} else {
			const urlForRecord = `${process.env.BASE_URL}record/${recordType}/${id}`;
			const parameters: IHttpClientRequestParameters = {
				url: urlForRecord,
			};
			httpClient
				.get<RecordWrapper>(parameters)
				.then((recordWrapper) => {
					const obj = convertToObjectWithRecordType<T>(
						recordWrapper.record.data,
						recordType
					);
					resolve(obj);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export { default as searchPersonsByNameSearch } from './api/searchPersonByNameSearch';
