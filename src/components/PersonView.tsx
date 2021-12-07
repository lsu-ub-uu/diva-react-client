import React from 'react';
import Person from '../control/Person';

type Props = {
	person: Person;
};

const PersonView = function ({ person }: Props) {
	return (
		<section>
			<span>{person.id}</span>
			<span>{person.authorisedName.givenName}</span>
			<span>{person.authorisedName.familyName}</span>
		</section>
	);
};

export default PersonView;
