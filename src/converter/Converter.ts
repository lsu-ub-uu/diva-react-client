import Name from '../control/Name';
import Person from '../control/Person';
import { DataAtomic, DataGroup } from './CoraData';
import { getFirstChildWithNameInData } from './CoraDataUtils';

export function convertPerson(dataGroup: DataGroup): Person {
	const id: string = extractIdFromDataGroup(dataGroup);

	const authorisedName: Name =
		extractAuthorisedNameFromPersonDataGroup(dataGroup);

	const orcid = extractOtherIdsFromDataGroup(dataGroup);
	let p = new Person(id, authorisedName);
	p.setOtherIds([{ id: orcid, type: 'ORCID' }]);
	return p;
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

function extractOtherIdsFromDataGroup(personDataGroup: DataGroup): string {
	let orcidToReturn = '';
	try {
		const orcid: DataAtomic = <DataAtomic>(
			getFirstChildWithNameInData(personDataGroup, 'ORCID_ID')
		);
		orcidToReturn = orcid.value.toString();
	} catch (error) {
		// TODO: decide what to do here...
	}
	return orcidToReturn;
}

export default convertPerson;
