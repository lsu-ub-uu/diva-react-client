import React from 'react';
import Person from '../control/Person';
import Card from './styles/Card';

type Props = {
	persons: Person[];
};

const PersonList = function (props: Props) {
	const { persons } = props;

	if (persons.length) {
		return (
			<div role="list">
				{persons.map((person) => {
					//let text = `${person.id}`;
					//text += person.domains ? ` [${person.domains.join(', ')}]` : '';
					return (
						<div className="marginBottom2em">
							<Card
								key={person.id}
								personName={person.authorisedName}
								personID={person.id}
							/>
						</div>
					);
				})}
			</div>
		);
	}
	return <div>No Data</div>;
};

export default PersonList;
