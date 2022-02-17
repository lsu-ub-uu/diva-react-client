import React from 'react';
import { useParams } from 'react-router-dom';
import { getRecordById } from '../../cora/api/api';
import { Person } from '../../cora/types/Person';
import { RecordType } from '../../cora/types/Record';
import useApi from '../../hooks/useApi';
import PersonView from './PersonView';

const PersonPage = function () {
	const { personId = '' } = useParams<string>();
	const { isLoading, result } = useApi<Person>(getRecordById, {
		recordType: RecordType.Person,
		id: personId,
	});

	return (
		<section>
			{result.error && <div>Någonting gick fel: {result.error.message}</div>}
			{isLoading && <div>Hämtar persondata...</div>}
			{result.data && <PersonView person={result.data} />}
		</section>
	);
};

export default PersonPage;
