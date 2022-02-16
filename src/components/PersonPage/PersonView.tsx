import React from 'react';
import { Person } from '../../cora/types/Person';
import Identifiers from './Identifiers';
import ListWithLabel from './ListWithLabel';
import ExternalLink from '../ExternalLink';

const PersonView = function ({ person }: { person: Person }) {
	let alternativeNames: string[] = [];
	if (person.alternativeNames !== undefined) {
		alternativeNames = person.alternativeNames.map((name) => {
			return `${name.familyName}, ${name.givenName}`;
		});
	}

	const possiblyGetOtherAffiliationText = () => {
		if (person.otherAffiliation === undefined) {
			return undefined;
		}
		const affiliation = person.otherAffiliation;

		let otherAffiliationText = person.otherAffiliation.name;

		if (affiliation.fromYear || affiliation.untilYear) {
			otherAffiliationText += ` (${displayYear(
				affiliation.fromYear
			)} - ${displayYear(affiliation.untilYear)})`;
		}

		return otherAffiliationText;
	};

	return (
		<>
			<h1>{displayName(person)}</h1>
			{person.academicTitle !== undefined && person.academicTitle !== '' && (
				<p data-testid="personTitle">{person.academicTitle}</p>
			)}
			{alternativeNames.length > 0 && (
				<ListWithLabel label="" list={alternativeNames} />
			)}
			{person.externalURLs !== undefined &&
				person.externalURLs.map((link) => {
					return (
						<ExternalLink key={link.URL} URL={link.URL} text={link.linkTitle} />
					);
				})}
			<Identifiers person={person} />
			{person.biographySwedish && (
				<div>
					Biografi
					<p>{person.biographySwedish}</p>
				</div>
			)}
			{possiblyGetOtherAffiliationText() && (
				<div data-testid="otherAffiliation">
					{possiblyGetOtherAffiliationText()}
				</div>
			)}
		</>
	);
};

const displayName = (person: Person) => {
	return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
};

const displayYear = (year: string | undefined) => {
	return year !== undefined ? year : '';
};

export default PersonView;
