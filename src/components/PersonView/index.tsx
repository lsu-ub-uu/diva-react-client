import React from 'react';
import { useParams } from 'react-router-dom';
import useGetPersonById from '../../hooks/useGetPersonById';

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
					{person.orcidIDs.length && <p>ORCID:</p>}
					{person.orcidIDs.map((id) => (
						<p key={id}>{id}</p>
					))}
				</div>
			)}
		</section>
	);
};

export default PersonView;
