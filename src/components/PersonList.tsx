import React from 'react';
import Person from '../control/Person';

type Props = {
	persons: Person[];
};

const PersonList = function (props: Props) {
	const { persons } = props;

	if (persons.length) {
		return (
			<div>
				<ul>
					{persons.map((person) => {
						let text = `${person.id}: ${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
						text += person.domains ? ` [${person.domains.join(', ')}]` : '';
						return <li key={person.id}>{text}</li>;
					})}
				</ul>
			</div>
		);
	}
	return <div>No Data</div>;
};

export default PersonList;
