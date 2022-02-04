import React from 'react';
import Person from '../../control/Person';
import Identifiers from './Identifiers';
import ListWithLabel from './ListWithLabel';

const PersonView = function ({ person }: { person: Person }) {
	const alternativeNames: string[] = person.alternativeNames.map((name) => {
		return name.toString();
	});

	return (
		<>
			<h1>{person.authorisedName.toString()}</h1>
			{person.academicTitle !== '' && (
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
