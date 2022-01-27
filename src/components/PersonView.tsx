import React from 'react';
import { useParams } from 'react-router-dom';
import useGetPersonById from '../hooks/useGetPersonById';

const PersonView = function () {
	const { personId = '' } = useParams();
	const { person, isLoading, error } = useGetPersonById(personId);
	return (
		<section>
			<span>Person ID: {personId}</span>
			{error && <div>Någonting gick fel: {error.message}</div>}
			{isLoading ? (
				<div>Hämtar persondata...</div>
			) : (
				<div>
					<p>{person?.authorisedName.toString()}</p>
					<p>
						{person?.otherIds[0]?.type}: {person?.otherIds[0]?.id}
					</p>
				</div>
			)}
		</section>
	);
};

export default PersonView;
