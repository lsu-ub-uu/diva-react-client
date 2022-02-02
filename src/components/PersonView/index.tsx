import React from 'react';
import { useParams } from 'react-router-dom';
import useGetPersonById from '../../hooks/useGetPersonById';
import Identifiers from './Identifiers';

const PersonView = function () {
	const { personId = '' } = useParams();
	const { person, isLoading, error } = useGetPersonById(personId);
	return (
		<section>
			{error && <div>Någonting gick fel: {error.message}</div>}
			{isLoading && <div>Hämtar persondata...</div>}
			{person && (
				<div>
					<p>{person.authorisedName.toString()}</p>
					<Identifiers person={person} />
				</div>
			)}
		</section>
	);
};

export default PersonView;
