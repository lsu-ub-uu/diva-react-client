import domainCollection from '../../lists/domainCollection';
import { deserializeMap } from './mapHandler';

const getDomainCollection = (): Map<string, string> => {
	return deserializeMap(domainCollection);
};

export default getDomainCollection;
