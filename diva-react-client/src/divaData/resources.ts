import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import domainCollection from '../../lists/domainCollection';
import { loginUnits } from '../../lists/loginUnits';

export const getDomainCollection = (): Map<string, string> => {
	return new Map(domainCollection);
};

export const getLoginUnits = (): LoginUnitObject[] => {
	return loginUnits;
};

export const getSortedLoginUnits = (): LoginUnitObject[] => {
	const loginUnitsToSort = Array.from(loginUnits);
	return loginUnitsToSort.sort((a, b) => {
		return a.displayTextSv.localeCompare(b.displayTextSv);
	});
};

export default getDomainCollection;
