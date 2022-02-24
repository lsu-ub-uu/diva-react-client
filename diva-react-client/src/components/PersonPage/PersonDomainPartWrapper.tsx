import React from 'react';
import { PersonDomainPart, RecordType } from 'diva-cora-ts-api-wrapper';
import RecordFetcher from '../RecordFetcher';
import PersonDomainPartView from './PersonDomainPartView';

const PersonDomainPartWrapper = function ({ id }: { id: string }) {
	if (id === '') {
		return <div />;
	}

	return (
		<RecordFetcher<PersonDomainPart>
			recordType={RecordType.PersonDomainPart}
			id={id}
		>
			{(injectedProps) => (
				<PersonDomainPartView personDomainPart={injectedProps.record} />
			)}
		</RecordFetcher>
	);
};

export default PersonDomainPartWrapper;
