import { Heading } from 'grommet';
import React from 'react';
import { FormAffiliation } from '../../types/FormPerson';
import AffiliationDisplay from './AffiliationDisplay';

const OtherAffiliation = function ({
	affiliation,
}: {
	affiliation: FormAffiliation;
}) {
	if (allFieldsAreEmpty(affiliation)) {
		return null;
	}

	return (
		<>
			<Heading level={4}>Andra organisationer (utanför DiVA)</Heading>
			<AffiliationDisplay affiliation={affiliation} />
		</>
	);
};

const allFieldsAreEmpty = (affiliation: FormAffiliation) => {
	return (
		affiliation.fromYear === '' &&
		affiliation.name === '' &&
		affiliation.untilYear === ''
	);
};

export default OtherAffiliation;
