import { List } from '../../../../dist/types';
import {
	dataListContainingOneOrganisation,
	dataListContainingThreeOrganisations,
	dataListContainingTwoOfFifteen,
} from '../../../../testData/searchResults';
import convertToObject from '../../../converter/Converter';
import organisationMatcher from '../../../converter/definitions/OrganisationDefinitions';
import { searchOrganisationsByDomain } from '../searchOrganisation';
import httpClient from '../../http/HttpClient';

jest.mock('../../http/HttpClient');

const mockHttpClientGet = httpClient.get as jest.MockedFunction<
	typeof httpClient.get
>;

jest.mock('../../../converter/Converter');
const mockConvertToObject = convertToObject as jest.MockedFunction<
	typeof convertToObject
>;

const domain = 'someDomain';
const searchEndpoint = 'record/searchResult/';

describe('searchOrganisations', () => {
	describe('searchOrganisationsByDomain', () => {
		beforeAll(() => {
			process.env.REST_API_BASE_URL = 'baseUrl/';
			mockHttpClientGet.mockResolvedValue(
				dataListContainingOneOrganisation
			);
		});

		it('Takes a domain', () => {
			searchOrganisationsByDomain('someDomain');
		});

		it('Rejects with error if empty domain was passed', async () => {
			expect.assertions(2);
			try {
				await searchOrganisationsByDomain('');
			} catch (error) {
				expect(error).toStrictEqual(
					new Error(
						'No domain was passed to searchOrganisationsByDomain.'
					)
				);
				expect(mockHttpClientGet).toHaveBeenCalledTimes(0);
			}
		});

		it('should correctly call HTTPClient with parameters', async () => {
			const organisationSearch = `publicOrganisationSearch?searchData={"name":"search","children":[{"name":"include","children":[{"name":"includePart","children":[{"name":"divaOrganisationDomainSearchTerm","value":"${domain}"}]}]},{"name":"start","value":"1"},{"name":"rows","value":"1000"}]}`;

			const expectedUrl =
				process.env.REST_API_BASE_URL +
				searchEndpoint +
				organisationSearch;

			expect.assertions(2);

			await searchOrganisationsByDomain(domain);

			expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
			expect(mockHttpClientGet).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expectedUrl,
				})
			);
		});

		it('should return empty list if httpClient returns with empty dataList, convertOrganisation should not have been called', async () => {
			mockHttpClientGet.mockResolvedValueOnce({
				dataList: {
					fromNo: '1',
					data: [],
					totalNo: '0',
					toNo: '0',
				},
			});

			expect.assertions(5);

			const returnedList: List = await searchOrganisationsByDomain(
				'someDomain'
			);

			expect(returnedList.data).toHaveLength(0);
			expect(returnedList.fromNumber).toStrictEqual(1);
			expect(returnedList.totalNumber).toStrictEqual(0);
			expect(returnedList.toNumber).toStrictEqual(0);

			expect(mockConvertToObject).not.toHaveBeenCalled();
		});

		describe('transformation to Organisation', () => {
			it('should call convertToObject once with correct data if httpClient resolves with dataList of size 1', async () => {
				mockHttpClientGet.mockResolvedValueOnce(
					dataListContainingOneOrganisation
				);

				expect.assertions(2);

				await searchOrganisationsByDomain('someDomain');

				expect(mockConvertToObject).toHaveBeenCalledTimes(1);
				expect(mockConvertToObject).toHaveBeenCalledWith(
					dataListContainingOneOrganisation.dataList.data[0].record
						.data,
					organisationMatcher
				);
			});

			it('should call convertToObject for each organisation in dataList', async () => {
				mockHttpClientGet.mockResolvedValueOnce(
					dataListContainingThreeOrganisations
				);

				expect.assertions(3);

				await searchOrganisationsByDomain('someDomain');
				expect(mockConvertToObject).toHaveBeenCalledTimes(3);
				expect(mockConvertToObject).toHaveBeenNthCalledWith(
					1,
					dataListContainingThreeOrganisations.dataList.data[0].record
						.data,
					organisationMatcher
				);
				expect(mockConvertToObject).toHaveBeenNthCalledWith(
					3,
					dataListContainingThreeOrganisations.dataList.data[2].record
						.data,
					organisationMatcher
				);
			});
		});
		it('should return List containing array of organisations as well as from/to/total from dataList', async () => {
			mockHttpClientGet.mockResolvedValueOnce(
				dataListContainingThreeOrganisations
			);

			expect.assertions(5);

			const list: List = await searchOrganisationsByDomain('someDomain');

			expect(mockConvertToObject).toHaveBeenCalledTimes(3);

			expect(list.data).toHaveLength(3);
			expect(list.fromNumber).toStrictEqual(1);
			expect(list.toNumber).toStrictEqual(3);
			expect(list.totalNumber).toStrictEqual(3);
		});

		it('should set from/to/total accordingly', async () => {
			mockHttpClientGet.mockResolvedValueOnce(
				dataListContainingTwoOfFifteen
			);

			expect.assertions(4);

			const list: List = await searchOrganisationsByDomain('someDomain');

			expect(mockConvertToObject).toHaveBeenCalledTimes(2);
			expect(list.fromNumber).toStrictEqual(3);
			expect(list.toNumber).toStrictEqual(4);
			expect(list.totalNumber).toStrictEqual(15);
		});
	});
});
