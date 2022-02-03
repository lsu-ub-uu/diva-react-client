import { DataGroup } from '../CoraData';
import GenericConverter from '../GenericConverter';
import createPersonFromPersonObject from './createPersonFromPersonObject';
import { personMultipleDefinition, PersonObject } from './PersonDefinitions';

const convertPersonDataGroupToPerson = (personDataGroup: DataGroup) => {
	const genericConverter = new GenericConverter(personMultipleDefinition);
	const personObject =
		genericConverter.convertToGenericObject<PersonObject>(personDataGroup);

	return createPersonFromPersonObject(personObject);
};

export default convertPersonDataGroupToPerson;
