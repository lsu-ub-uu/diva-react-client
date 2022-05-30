import React from 'react';
import { useParams } from 'react-router-dom';
import PersonView from './PersonView';
import PersonEdit from './PersonEdit/PersonEdit';
import PersonFetcher from './PersonFetcher';

// eslint-disable-next-line react/require-default-props
const PersonPage = function ({ edit = false }: { edit?: boolean }) {
	const { personId = '' } = useParams<string>();

	if (personId === undefined || personId === '') {
		return <p>Ange ID f&ouml;r att h&auml;mta person.</p>;
	}

	return (
		<PersonFetcher id={personId}>
			{(injectedProps) => {
				const { person, organisations, personDomainParts } =
					injectedProps.record;
				if (edit) {
					return (
						<PersonEdit
							originalPerson={person}
							originalOrganisations={organisations}
							originalPersonDomainParts={personDomainParts}
						/>
					);
				}
				return <PersonView person={person} />;
			}}
		</PersonFetcher>
	);
};

export default PersonPage;
