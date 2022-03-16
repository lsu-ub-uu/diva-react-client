import { getRecords, RecordType } from 'diva-cora-ts-api-wrapper';
import listWithThreeLoginUnits from '../testData/loginUnitsTestData';
import fetchLoginUnits from './loginUnitFetcher';

jest.mock('diva-cora-ts-api-wrapper', () => ({
	...jest.requireActual('diva-cora-ts-api-wrapper'),
	getRecords: jest.fn(),
	getRecordById: jest.fn(),
}));

const mockGetRecords = getRecords as jest.MockedFunction<typeof getRecords>;

beforeAll(() => {
	mockGetRecords.mockResolvedValue(listWithThreeLoginUnits);
});

describe('loginUnitFetcher', () => {
	describe('fetchLoginUnits', () => {
		it('exists', () => {
			fetchLoginUnits();
		});

		describe('getRecords', () => {
			it('calls getRecords with RecordType.LoginUnit', () => {
				fetchLoginUnits();

				expect(getRecords).toHaveBeenCalledWith(RecordType.LoginUnit);
			});
			it('rejects with error if getRecords rejects', async () => {
				const expectedError = new Error('someErrorFromGetRecords');
				mockGetRecords.mockRejectedValueOnce(expectedError);

				expect.assertions(1);
				try {
					await fetchLoginUnits();
				} catch (error) {
					expect(error).toStrictEqual(expectedError);
				}
			});

			it('calls convertToObjectWithRecordType for each recordWrapper in dataList', async () => {
				await fetchLoginUnits();
			});
		});
	});
});
