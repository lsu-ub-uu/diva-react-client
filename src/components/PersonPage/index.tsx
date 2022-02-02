import React from 'react';
import { useParams } from 'react-router-dom';
import useGetPersonById from '../../hooks/useGetPersonById';
import PersonView from './PersonView';

const PersonPage = function () {
	const { personId = '' } = useParams<string>();
	const { person, isLoading, error } = useGetPersonById(personId);
	return (
		<section>
			{error && <div>Någonting gick fel: {error.message}</div>}
			{isLoading && <div>Hämtar persondata...</div>}
			{person && <PersonView person={person} />}
		</section>
	);
};

export default PersonPage;
