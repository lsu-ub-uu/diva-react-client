import convertPerson from '../../converter/Converter';
import {
	DataGroup,
	DataListWrapper,
	RecordWrapper,
} from '../../converter/CoraData';
import httpClient from '../HttpClient';
import { IHttpClientRequestParameters } from '../IHttpClient';
import List from '../List';
import Person from '../Person';

const searchEndpoint = 'record/searchResult/';
const nameSearch = `publicPersonSearch?searchData=`;

function searchPersonsByNameSearch(
	searchTerm: string,
	start?: number,
	rows?: number
): Promise<List<Person>> {
	return new Promise((resolve, reject) => {
		if (searchTerm === '') {
			reject(
				new Error('No searchTerm was passed to searchPersonsByNameSearch')
			);
		} else {
			const urlForPersonSearch = composeUrlForPersonSearch(
				searchTerm,
				start,
				rows
			);

			const parameters: IHttpClientRequestParameters = {
				url: urlForPersonSearch,
			};

			httpClient
				.get<DataListWrapper>(parameters)
				.then((dataListWrapper) => {
					const personList = extractListFromDataList(dataListWrapper);

					resolve(personList);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

function composeUrlForPersonSearch(
	searchTerm: string,
	start?: number,
	rows?: number
) {
	const searchData = composeReturnData(searchTerm, start, rows);
	return (
		process.env.BASE_URL +
		searchEndpoint +
		nameSearch +
		JSON.stringify(searchData)
	);
}

const composeReturnData = (
	searchTerm: string,
	start?: number,
	rows?: number
) => {
	const searchData: DataGroup = {
		name: 'search',
		children: [
			{
				name: 'include',
				children: [
					{
						name: 'includePart',
						children: [
							{
								name: 'personNameSearchTerm',
								value: searchTerm,
							},
						],
					},
				],
			},
		],
	};

	if (start && start > 0) {
		searchData.children.push({
			name: 'start',
			value: start.toString(),
		});
	}

	if (rows && rows > 0) {
		searchData.children.push({
			name: 'rows',
			value: rows.toString(),
		});
	}

	return searchData;
};

function extractListFromDataList(
	dataListWrapper: DataListWrapper
): List<Person> {
	let persons: Person[] = [];

	if (dataListWrapper.dataList.data.length > 0) {
		const records: RecordWrapper[] = dataListWrapper.dataList.data;

		persons = records.map((recordWrapper) => {
			return convertPerson(recordWrapper.record.data);
		});
	}
	const fromNumber = parseInt(dataListWrapper.dataList.fromNo, 10);
	const toNumber = parseInt(dataListWrapper.dataList.toNo, 10);
	const totalNumber = parseInt(dataListWrapper.dataList.totalNo, 10);

	const list = new List<Person>(persons, fromNumber, toNumber, totalNumber);

	return list;
}

export default searchPersonsByNameSearch;
