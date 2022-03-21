import { Organisation } from 'diva-cora-ts-api-wrapper';

const createOrganisationWithNameAndId = (
	name: string,
	id: string
): Organisation => {
	return {
		name,
		alternativeName: `${name}Alternative`,
		id,
		recordType: 'organisation',
		organisationType: 'topOrganisation',
	};
};

export default createOrganisationWithNameAndId;
