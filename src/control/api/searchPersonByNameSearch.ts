import httpClient from '../HttpClient';
import { IHttpClientRequestParameters } from '../IHttpClient';

function searchPersonsByNameSearch(
	searchTerm: string,
	start?: number,
	rows?: number
) {
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
				.get(parameters)
				.then(() => {
					// receives dataList from api
					// foreach element in dataList -> call convertPerson
					// resolve with ???
					// - List
					resolve('');
				})
				.catch((error: unknown) => {
					reject(error);
				});
		}
	});
}

export default searchPersonsByNameSearch;
