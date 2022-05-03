import React from 'react';
import { Affiliation } from 'diva-cora-ts-api-wrapper';

const AffiliationDisplay = function ({
	affiliation,
}: {
	affiliation: { name: string; untilYear: string; fromYear: string };
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

	return <p>{getAffiliationText()}</p>;
};

const displayYear = (year: string | undefined) => {
	return year !== undefined ? year : '';
};

export default AffiliationDisplay;
