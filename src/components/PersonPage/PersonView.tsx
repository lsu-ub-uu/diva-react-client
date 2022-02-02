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
			{person.title !== '' && <p data-testid="personTitle">{person.title}</p>}
			{alternativeNames.length > 0 && (
				<ListWithLabel label="" list={alternativeNames} />
			)}
			<Identifiers person={person} />
		</>
	);
};

export default PersonView;
