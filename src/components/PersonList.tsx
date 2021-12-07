import React from 'react';
import Person from '../control/Person';
import List from '../styles/List';
import Card from './Card';

type Props = {
	persons: Person[];
};

const PersonList = function (props: Props) {
	const { persons } = props;

	if (persons.length) {
		return (
			<List>
				{persons.map((person) => {
					const text = `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
					return (
						<li key={person.id}>
							<Card text={text} id={person.id} />
						</li>
					);
				})}
			</List>
		);
	}
	return <div>Ingen data</div>;
};

export default PersonList;
