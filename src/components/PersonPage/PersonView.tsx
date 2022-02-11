import React from 'react';
import { PersonObject } from '../../converter/Person/PersonDefinitions';
import Identifiers from './Identifiers';
import ListWithLabel from './ListWithLabel';

const PersonView = function ({ person }: { person: PersonObject }) {
	let alternativeNames: string[] = [];
	if (person.alternativeNames !== undefined) {
		alternativeNames = person.alternativeNames.map((name) => {
			return `${name.familyName}, ${name.givenName}`;
		});
	}

	return (
		<>
			<h1>{`${person.authorisedName.familyName}, ${person.authorisedName.givenName}`}</h1>
			{person.academicTitle !== undefined && person.academicTitle !== '' && (
				<p data-testid="personTitle">{person.academicTitle}</p>
			)}
			{alternativeNames.length > 0 && (
				<ListWithLabel label="" list={alternativeNames} />
			)}
			<Identifiers person={person} />
		</>
	);
};

export default PersonView;
