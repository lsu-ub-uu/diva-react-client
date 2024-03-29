import convertToObject from '../../converter/Converter';
import {
	DataGroup,
	DataListWrapper,
	RecordWrapper,
} from '../../cora-data/CoraData';
import { personMatcher } from '../../converter/definitions/PersonDefinitions';
import httpClient from '../http/HttpClient';
import { IHttpClientRequestParameters } from '../http/IHttpClient';
import { List } from '../../types/List';
import { Person } from '../../types/Person';

const searchEndpoint = 'record/searchResult/';
const generalSearch = `publicPersonSearch?searchData=`;

function searchPersonsByGeneralSearch(
	searchTerm: string,
	start: number,
	rows: number,
	authToken?: string
): Promise<List> {
	return new Promise((resolve, reject) => {
		if (searchTerm === '') {
			reject(
				new Error(
					'No searchTerm was passed to searchPersonsByGeneralSearch'
				)
			);
		} else {
			const urlForPersonSearch = composeUrlForPersonSearch(
				searchTerm,
				start,
				rows
			);

			const parameters: IHttpClientRequestParameters = {
				url: urlForPersonSearch,
				authToken,
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
		// process.env.REST_API_BASE_URL +
		`https://cora.test.diva-portal.org/diva/rest/${searchEndpoint}${generalSearch}${JSON.stringify(
			searchData
		)}`
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
								name: 'personGeneralSearchTerm',
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

function extractListFromDataList(dataListWrapper: DataListWrapper): List {
	let persons: Person[] = [];

	if (dataListWrapper.dataList.data.length > 0) {
		const records: RecordWrapper[] = dataListWrapper.dataList.data;

		persons = records.map((recordWrapper) => {
			return convertToObject<Person>(
				recordWrapper.record.data,
				personMatcher
			);
		});
	}
	const fromNumber = parseInt(dataListWrapper.dataList.fromNo, 10);
	const toNumber = parseInt(dataListWrapper.dataList.toNo, 10);
	const totalNumber = parseInt(dataListWrapper.dataList.totalNo, 10);

	const list = new List(persons, fromNumber, toNumber, totalNumber);

	return list;
}

export { searchPersonsByGeneralSearch };
