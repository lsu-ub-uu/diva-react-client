import React from 'react';
import styled from 'styled-components';
import Person from '../../control/Person';
import ListWithLabel from './ListWithLabel';

const StyledDiv = styled.div`
	display: grid;
	grid-template-columns: max-content auto;
	column-gap: 0.5em;
`;

const Identifiers = function ({ person }: { person: Person }) {
	return (
		<StyledDiv>
			<ListWithLabel list={[person.id]} label="pID" />
			{person.orcidIDs.length > 0 && (
				<ListWithLabel list={person.orcidIDs} label="ORCID" />
			)}

			{person.viafIDs.length > 0 && (
				<ListWithLabel list={person.viafIDs} label="VIAF" />
			)}

			{person.librisIDs.length > 0 && (
				<ListWithLabel list={person.librisIDs} label="Libris-id" />
			)}
		</StyledDiv>
	);
};

export default Identifiers;
