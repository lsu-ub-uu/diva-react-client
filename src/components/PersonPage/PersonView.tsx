import React from 'react';
import Person from '../../control/Person';
import Identifiers from './Identifiers';

const PersonView = function ({ person }: { person: Person }) {
	return (
		<>
			<p>{person.authorisedName.toString()}</p>
			<Identifiers person={person} />
		</>
	);
};

export default PersonView;
