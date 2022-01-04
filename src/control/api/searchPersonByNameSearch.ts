import convertPerson from '../../converter/Converter';
import { DataListWrapper, RecordWrapper } from '../../converter/CoraData';
import httpClient from '../HttpClient';
import { IHttpClientRequestParameters } from '../IHttpClient';
import List from '../List';
import Person from '../Person';
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
			const searchEndpoint = 'record/searchResult/';
			const nameSearch = `publicPersonSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"personNameSearchTerm","value":"${searchTerm}"}]}]}]}`;
			const urlForPersonSearch =
				process.env.BASE_URL + searchEndpoint + nameSearch;

			const parameters: IHttpClientRequestParameters = {
				url: urlForPersonSearch,
			};

			httpClient
				.get<DataListWrapper>(parameters)
				.then((dataListWrapper) => {
					// receives dataList from api
					// foreach element in dataList -> call convertPerson
					// resolve with ???
					// - List
					const persons: Person[] = [];
					if (dataListWrapper.dataList.data.length > 0) {
						const records: RecordWrapper[] = dataListWrapper.dataList.data;

						records.map((recordWrapper) => {
							persons.push(convertPerson(recordWrapper.record.data));
						});
					}
					resolve(new List<Person>(persons, 1, 0, 0));
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export default searchPersonsByNameSearch;
