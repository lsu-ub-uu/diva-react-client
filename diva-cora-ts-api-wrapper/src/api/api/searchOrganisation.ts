import { Organisation } from '../..';
import convertToObject from '../../converter/Converter';
import organisationMatcher from '../../converter/definitions/OrganisationDefinitions';
import {
	DataGroup,
	DataListWrapper,
	RecordWrapper,
} from '../../cora-data/CoraData';
import { List } from '../../types/List';
import httpClient from '../http/HttpClient';
import { IHttpClientRequestParameters } from '../http/IHttpClient';

const searchEndpoint = 'record/searchResult/';
const domainSearch = `publicOrganisationSearch?searchData=`;

export function searchOrganisationsByDomainAndSearchTerm(
	domain: string,
	searchTerm: string,
	authToken?: string
): Promise<List> {
	return new Promise((resolve, reject) => {
		if (domain === '') {
			reject(new Error('No domain was passed to searchOrganisationsByDomain.'));
		} else {
			const urlForSearch = composeUrlForDomainSearch(domain, searchTerm);

			const parameters: IHttpClientRequestParameters = {
				url: urlForSearch,
				authToken,
			};

			httpClient
				.get<DataListWrapper>(parameters)
				.then((dataListWrapper) => {
					const list = extractListFromDataList(dataListWrapper);
					resolve(list);
				})
				.catch((error) => {
					reject(error);
				});
		}
	});
}

export function searchOrganisationsByDomain(
	domain: string,
	authToken?: string
): Promise<List> {
	return new Promise((resolve, reject) => {
		if (domain === '') {
			reject(new Error('No domain was passed to searchOrganisationsByDomain.'));
		} else {
			const urlForSearch = composeUrlForDomainSearch(domain);

			const parameters: IHttpClientRequestParameters = {
				url: urlForSearch,
				authToken,
			};

			httpClient
				.get<DataListWrapper>(parameters)
				.then((dataListWrapper) => {
					const list = extractListFromDataList(dataListWrapper);
					resolve(list);
				})
				.catch((error) => {
					reject(error);
				});
		}
	});
}

function composeUrlForDomainSearch(domain: string, searchTerm?: string) {
	const searchData = composeSearchDataForDomain(domain, searchTerm, 1, 1000);
	return (
		process.env.REST_API_BASE_URL +
		searchEndpoint +
		domainSearch +
		JSON.stringify(searchData)
	);
}

const composeSearchDataForDomain = (
	domain: string,
	searchTerm?: string,
	start?: number,
	rows?: number
) => {
	const includeParts = [
		{
			name: 'divaOrganisationDomainSearchTerm',
			value: domain,
		},
	];
	if (searchTerm && searchTerm !== '') {
		includeParts.push({
			name: 'divaOrganisationNameSearchTerm',
			value: searchTerm,
		});
	}

	const searchData: DataGroup = {
		name: 'search',
		children: [
			{
				name: 'include',
				children: [
					{
						name: 'includePart',
						children: includeParts,
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
	let organisations: Organisation[] = [];

	if (dataListWrapper.dataList.data.length > 0) {
		const records: RecordWrapper[] = dataListWrapper.dataList.data;

		organisations = records.map((recordWrapper) => {
			return convertToObject<Organisation>(
				recordWrapper.record.data,
				organisationMatcher
			);
		});
	}
	const fromNumber = parseInt(dataListWrapper.dataList.fromNo, 10);
	const toNumber = parseInt(dataListWrapper.dataList.toNo, 10);
	const totalNumber = parseInt(dataListWrapper.dataList.totalNo, 10);

	const list = new List(organisations, fromNumber, toNumber, totalNumber);

	return list;
}
