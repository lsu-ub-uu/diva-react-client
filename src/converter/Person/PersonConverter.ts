import { DataGroup } from '../CoraData';
import GenericConverter from '../GenericConverter';
import { personMultipleDefinition } from './PersonDefinitions';

const convertPersonDataGroupToPerson = (personDataGroup: DataGroup) => {
	const genericConverter = new GenericConverter(personMultipleDefinition);
	genericConverter.convertToGenericObject(personDataGroup);
};

export default convertPersonDataGroupToPerson;
