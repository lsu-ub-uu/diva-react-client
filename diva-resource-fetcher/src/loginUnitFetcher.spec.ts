import {
	getRecordById,
	getRecords,
	RecordType,
	LoginUnitObject,
	LoginType,
	CoraText,
	LoginWebRedirect,
} from 'diva-cora-ts-api-wrapper';
import listWithThreeLoginUnits from '../testData/loginUnitsTestData';
import fetchLoginUnits from './loginUnitFetcher';

jest.mock('diva-cora-ts-api-wrapper', () => ({
	...jest.requireActual('diva-cora-ts-api-wrapper'),
	getRecords: jest.fn(),
	getRecordById: jest.fn(),
}));

const mockGetRecords = getRecords as jest.MockedFunction<typeof getRecords>;
const mockGetRecordById = getRecordById as jest.MockedFunction<
	typeof getRecordById
>;

beforeEach(() => {
	mockGetRecords.mockResolvedValue(listWithThreeLoginUnits);
	mockGetRecordById.mockResolvedValue({ url: 'someDefaultUrl' });

	mockGetRecordById.mockImplementation((recordType: RecordType, id: string) => {
		return new Promise((resolve) => {
			if (recordType === RecordType.CoraText) {
				const coraText: CoraText = {
					id: 'someId',
					recordType: 'coraText',
					defaultText: { text: `someTextSv${id}` },
					alternativeText: { text: `someTextEn${id}` },
				};
				resolve(coraText);
			}
			if (recordType === RecordType.LoginWebRedirect) {
				const loginWebRedirect: LoginWebRedirect = {
					id: 'someId',
					recordType: 'loginWebRedirect',
					url: `url${id}`,
				};
				resolve(loginWebRedirect);
			}
		});
	});
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

			describe('for each element in List.data with loginType === RecordType.LoginWebRedirect', () => {
				it('calls getRecordById with recordType: LoginWebRedirect and id: loginInfo.loginName', async () => {
					await fetchLoginUnits();

					expect(mockGetRecordById).toHaveBeenCalledTimes(4);
					expect(mockGetRecordById).toHaveBeenCalledWith(
						RecordType.LoginWebRedirect,
						'someLoginName1'
					);
					expect(mockGetRecordById).toHaveBeenCalledWith(
						RecordType.LoginWebRedirect,
						'someLoginName3'
					);
				});

				it('calls getRecordById with recordType: CoraText and id: loginInfo.loginDescriptionName', async () => {
					await fetchLoginUnits();

					expect(mockGetRecordById).toHaveBeenCalledTimes(4);
					expect(mockGetRecordById).toHaveBeenCalledWith(
						RecordType.CoraText,
						'someLoginDescription1'
					);
					expect(mockGetRecordById).toHaveBeenCalledWith(
						RecordType.CoraText,
						'someLoginDescription3'
					);
				});
			});

			it('resolves with List of LoginUnitObjects', async () => {
				const expectedLoginUnits: LoginUnitObject[] = [
					{
						type: LoginType.LoginWebRedirect,
						url: 'urlsomeLoginName1',
						displayTextSv: 'someTextSvsomeLoginDescription1',
						displayTextEn: 'someTextEnsomeLoginDescription1',
					},
					{
						type: LoginType.LoginWebRedirect,
						url: 'urlsomeLoginName3',
						displayTextSv: 'someTextSvsomeLoginDescription3',
						displayTextEn: 'someTextEnsomeLoginDescription3',
					},
				];
				const loginUnits: LoginUnitObject[] = await fetchLoginUnits();

				expect(loginUnits).toStrictEqual(expectedLoginUnits);
			});
		});
	});
});
