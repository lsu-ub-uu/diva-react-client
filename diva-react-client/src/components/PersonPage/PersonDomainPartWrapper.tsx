import React from 'react';
import { PersonDomainPart, RecordType } from 'diva-cora-ts-api-wrapper';
import RecordFetcher from '../RecordFetcher';
import PersonDomainPartView from './PersonDomainPartView';
import PersonDomainPartEdit from './PersonDomainPartEdit';

const PersonDomainPartWrapper = function ({
	id,
	edit = false,
}: {
	id: string;
	edit?: boolean;
}) {
	if (id === '') {
		return <div />;
	}

	const renderViewOrEdit = (personDomainPart: PersonDomainPart) => {
		if (edit) {
			return <PersonDomainPartEdit personDomainPart={personDomainPart} />;
		}
		return <PersonDomainPartView personDomainPart={personDomainPart} />;
	};

	return (
		<RecordFetcher<PersonDomainPart>
			recordType={RecordType.PersonDomainPart}
			id={id}
		>
			{(injectedProps) => renderViewOrEdit(injectedProps.record)}
		</RecordFetcher>
	);
};

export default PersonDomainPartWrapper;
