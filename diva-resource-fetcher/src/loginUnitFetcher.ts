import {
	CoraText,
	getRecordById,
	getRecords,
	List,
	LoginType,
	LoginUnit,
	LoginUnitObject,
	LoginWebRedirect,
	RecordType,
} from 'diva-cora-ts-api-wrapper';

const fetchLoginUnits = async (): Promise<LoginUnitObject[]> => {
	return new Promise((resolve, reject) => {
		getRecords(RecordType.LoginUnit)
			.then((list: List) => {
				const listOfWebRedirectLogins = list.data.filter((item) => {
					return item.loginInfo.loginType === RecordType.LoginWebRedirect;
				});

				const promises = listOfWebRedirectLogins.map((loginUnit) =>
					fetchUrlAndDisplayText(loginUnit)
				);

				Promise.all(promises).then((loginUnitObjects) => {
					resolve(loginUnitObjects);
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
};

const fetchUrlAndDisplayText = async (
	loginUnit: LoginUnit
): Promise<LoginUnitObject> => {
	return new Promise((resolve, reject) => {
		const loginWebRedirectPromise = getRecordById<LoginWebRedirect>(
			RecordType.LoginWebRedirect,
			loginUnit.loginInfo.loginName
		);

		const coraTextPromise = getRecordById<CoraText>(
			RecordType.CoraText,
			loginUnit.loginInfo.loginDescriptionName
		);

		Promise.all([loginWebRedirectPromise, coraTextPromise])
			.then((result) => {
				const [loginWebRedirect, coraText] = result;

				const loginUnitObject: LoginUnitObject = {
					type: LoginType.LoginWebRedirect,
					url: loginWebRedirect.url,
					displayTextSv: coraText.defaultText.text,
					displayTextEn:
						coraText.alternativeText !== undefined
							? coraText.alternativeText.text
							: '',
				};

				resolve(loginUnitObject);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export default fetchLoginUnits;
