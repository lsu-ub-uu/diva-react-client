import domainCollection from '../../lists/domainCollection';

const getDomainCollection = (): Map<string, string> => {
	return new Map(domainCollection);
};

export default getDomainCollection;
