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
				const webRedirectLogins = getAllWebRedirectLogins(list);

				const promises = webRedirectLogins.map((record) => {
					const loginUnit = record as LoginUnit;
					return fetchWebRedirectDataAndCreateLoginUnitObject(loginUnit);
				});

				Promise.all(promises).then((loginUnitObjects) => {
					resolve(loginUnitObjects);
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
};

function getAllWebRedirectLogins(list: List) {
	const loginUnits = list.data as LoginUnit[];
	return loginUnits.filter((item) => {
		return item.loginInfo.loginType === RecordType.LoginWebRedirect;
	});
}

const fetchWebRedirectDataAndCreateLoginUnitObject = async (
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

				const loginUnitObject: LoginUnitObject = createLoginUnitObject(
					loginWebRedirect,
					coraText
				);

				resolve(loginUnitObject);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

function createLoginUnitObject(
	loginWebRedirect: LoginWebRedirect,
	coraText: CoraText
): LoginUnitObject {
	return {
		type: LoginType.LoginWebRedirect,
		url: loginWebRedirect.url,
		displayTextSv: coraText.defaultText.text,
		displayTextEn:
			coraText.alternativeText !== undefined
				? coraText.alternativeText.text
				: '',
	};
}

export default fetchLoginUnits;
