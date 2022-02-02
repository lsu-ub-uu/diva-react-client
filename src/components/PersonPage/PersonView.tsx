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
			<p>{person.authorisedName.toString()}</p>
			{alternativeNames.length > 0 && (
				<ListWithLabel label="" list={alternativeNames} />
			)}
			<Identifiers person={person} />
		</>
	);
};

export default PersonView;
