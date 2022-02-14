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
					return <ExternalLink URL={link.URL} text={link.linkTitle} />;
				})}
			<Identifiers person={person} />
		</>
	);
};

const displayName = (person: Person) => {
	return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
};

export default PersonView;
