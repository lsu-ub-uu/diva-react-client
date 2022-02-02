import Name from '../control/Name';
import Person from '../control/Person';
import { DataAtomic, DataGroup } from './CoraData';
import {
	getAllChildrenWithNameInData,
	getFirstChildWithNameInData,
} from './CoraDataUtils';

const ORCID_NAME_IN_DATA = 'ORCID_ID';
const VIAF_NAME_IN_DATA = 'VIAF_ID';
const LIBRIS_NAME_IN_DATA = 'Libris_ID';

let person: Person;

export function convertPerson(dataGroup: DataGroup): Person {
	const id: string = extractIdFromDataGroup(dataGroup);

	const authorisedName: Name =
		extractAuthorisedNameFromPersonDataGroup(dataGroup);

	person = new Person(id, authorisedName);

	possiblyAddOtherIdsFromDataGroup(dataGroup);
	return person;
}

function extractIdFromDataGroup(dataGroup: DataGroup): string {
	const recordInfo: DataGroup = <DataGroup>(
		getFirstChildWithNameInData(dataGroup, 'recordInfo')
	);

	const idAtomic: DataAtomic = <DataAtomic>(
		getFirstChildWithNameInData(recordInfo, 'id')
	);

	return idAtomic.value;
}

function extractAuthorisedNameFromPersonDataGroup(
	personDataGroup: DataGroup
): Name {
	const nameToReturn: Name = new Name('', '');

	const authorisedName: DataGroup = <DataGroup>(
		getFirstChildWithNameInData(personDataGroup, 'authorisedName')
	);

	if (authorisedName === null) {
		return nameToReturn;
	}

	const familyName: DataAtomic = <DataAtomic>(
		getFirstChildWithNameInData(authorisedName, 'familyName')
	);
	if (familyName !== null) {
		nameToReturn.familyName = familyName.value;
	}

	const givenName: DataAtomic = <DataAtomic>(
		getFirstChildWithNameInData(authorisedName, 'givenName')
	);

	if (givenName !== null) {
		nameToReturn.givenName = givenName.value;
	}

	return nameToReturn;
}

function possiblyAddOtherIdsFromDataGroup(personDataGroup: DataGroup) {
	const orcidChildren = <DataAtomic[]>(
		getAllChildrenWithNameInData(personDataGroup, ORCID_NAME_IN_DATA)
	);
	orcidChildren.forEach((child) => {
		if (child.value !== '') {
			person.orcidIDs.push(child.value);
		}
	});

	const viafChildren = <DataAtomic[]>(
		getAllChildrenWithNameInData(personDataGroup, VIAF_NAME_IN_DATA)
	);
	viafChildren.forEach((child) => {
		if (child.value !== '') {
			person.viafIDs.push(child.value);
		}
	});

	const librisChildren = <DataAtomic[]>(
		getAllChildrenWithNameInData(personDataGroup, LIBRIS_NAME_IN_DATA)
	);
	librisChildren.forEach((child) => {
		if (child.value !== '') {
			person.librisIDs.push(child.value);
		}
	});
}

export default convertPerson;
