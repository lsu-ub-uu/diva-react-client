import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import useGetPersonById from '../../hooks/useGetPersonById';
import ListWithLabel from './ListWithLabel';

const Identifiers = styled.div`
	display: grid;
	grid-template-columns: max-content auto;
	column-gap: 0.5em;
`;

const PersonView = function () {
	const { personId = '' } = useParams();
	const { person, isLoading, error } = useGetPersonById(personId);
	return (
		<section>
			<span>Person ID: {personId}</span>
			{error && <div>Någonting gick fel: {error.message}</div>}
			{isLoading && <div>Hämtar persondata...</div>}
			{person && (
				<div>
					<p>{person.authorisedName.toString()}</p>
					<Identifiers>
						{person.orcidIDs.length > 0 && (
							<ListWithLabel list={person.orcidIDs} label="ORCID" />
						)}

						{person.viafIDs.length > 0 && (
							<ListWithLabel list={person.viafIDs} label="VIAF" />
						)}

						{person.librisIDs.length > 0 && (
							<ListWithLabel list={person.librisIDs} label="Libris-id" />
						)}
					</Identifiers>
				</div>
			)}
		</section>
	);
};

export default PersonView;
