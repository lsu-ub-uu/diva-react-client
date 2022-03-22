import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import domainCollection from '../../lists/domainCollection';
import { loginUnits } from '../../lists/loginUnits';

export const getDomainCollection = (): Map<string, string> => {
	return new Map(domainCollection);
};

export const getLoginUnits = (): LoginUnitObject[] => {
	return loginUnits;
};

export default getDomainCollection;
