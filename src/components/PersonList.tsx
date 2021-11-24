import React from 'react';
import Person from '../control/Person';

type Props = {
	persons: Person[];
};

const PersonList = (props: Props) => {
	const { persons } = props;

	return (
		<ul>
			{persons.map((person) => {
				let text = `${person.id}: ${person.authorizedName.familyName}, ${person.authorizedName.givenName}`;
				text += person.domains ? ` [${person.domains.join(', ')}]` : '';
				return <li key={person.id}>{text}</li>;
			})}
		</ul>
	);
};

export default PersonList;
