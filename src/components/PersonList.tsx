import React from 'react';
import styled from 'styled-components';
import Person from '../control/Person';
import Card from './Card';

type Props = {
	persons: Person[];
};

const StyledDIV = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 1em;
`;

const PersonList = function (props: Props) {
	const { persons } = props;

	if (persons.length) {
		return (
			<StyledDIV role="list">
				{persons.map((person) => {
					const text = `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
					return <Card key={person.id} text={text} id={person.id} />;
				})}
			</StyledDIV>
		);
	}
	return <div>No Data</div>;
};

export default PersonList;
