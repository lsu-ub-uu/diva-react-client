import Name from '../control/Name';
import Person from '../control/Person';
import { DataAtomic, DataGroup } from './CoraData';
import { getFirstChildWithNameInData } from './CoraDataUtils';

export function convertPerson(dataGroup: DataGroup): Person {
	const id: string = extractIdFromDataGroup(dataGroup);

	const authorisedName: Name =
		extractAuthorisedNameFromPersonDataGroup(dataGroup);

	return new Person(id, authorisedName);
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

	try {
		const authorisedName: DataGroup = <DataGroup>(
			getFirstChildWithNameInData(personDataGroup, 'authorisedName')
		);

		const familyName: DataAtomic = <DataAtomic>(
			getFirstChildWithNameInData(authorisedName, 'familyName')
		);

		const givenName: DataAtomic = <DataAtomic>(
			getFirstChildWithNameInData(authorisedName, 'givenName')
		);

		nameToReturn.familyName = familyName.value;
		nameToReturn.givenName = givenName.value;
	} catch (error) {
		// TODO: decide what to do here...
	}

	return nameToReturn;
}

export default convertPerson;
