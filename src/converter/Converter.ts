import Person from '../control/Person';
import { DataGroup } from './CoraData';

export function convertPerson(dataGroup: DataGroup): Person {
	return {
		authorisedName: {
			familyName: 'bar',
			givenName: 'foo',
		},
		id: '2',
	};
}

export default convertPerson;
