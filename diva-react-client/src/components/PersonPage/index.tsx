import React from 'react';
import { useParams } from 'react-router-dom';
import { Person, RecordType } from 'diva-cora-ts-api-wrapper';
import RecordFetcher from '../RecordFetcher';
import PersonView from './PersonView';
import PersonEdit from './PersonEdit';

const PersonPage = function ({ edit = false }: { edit?: boolean }) {
	const { personId = '' } = useParams<string>();

	if (personId === undefined || personId === '') {
		return <p>Ange ID f&ouml;r att h&auml;mta person.</p>;
	}

	return (
		<RecordFetcher<Person> recordType={RecordType.Person} id={personId}>
			{(injectedProps) => {
				if (edit) {
					return <PersonEdit originalPerson={injectedProps.record} />;
				}
				return <PersonView person={injectedProps.record} />;
			}}
		</RecordFetcher>
	);
};

export default PersonPage;
