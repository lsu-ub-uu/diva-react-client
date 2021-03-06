import React from 'react';
import { Paragraph } from 'grommet';
import { Affiliation } from 'diva-cora-ts-api-wrapper';

const AffiliationDisplay = function ({
	affiliation,
}: {
	affiliation: Affiliation;
}) {
	const getAffiliationText = () => {
		let affiliationName = affiliation.name;

		if (affiliation.fromYear || affiliation.untilYear) {
			affiliationName += ` (${displayYear(
				affiliation.fromYear
			)} - ${displayYear(affiliation.untilYear)})`;
		}

		return affiliationName;
	};

	return <Paragraph>{getAffiliationText()}</Paragraph>;
};

const displayYear = (year: string | undefined) => {
	return year !== undefined ? year : '';
};

export default AffiliationDisplay;
