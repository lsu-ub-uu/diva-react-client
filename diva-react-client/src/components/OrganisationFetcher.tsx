import { Organisation, RecordType } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import OrganisationView from './PersonPage/OrganisationView';
import RecordFetcher from './RecordFetcher';

const OrganisationFetcher = function ({ id }: { id: string }) {
	if (id === '') {
		return <div />;
	}

	return (
		<RecordFetcher<Organisation> recordType={RecordType.Organisation} id={id}>
			{(injectedProps) => (
				<OrganisationView organisation={injectedProps.record} />
			)}
		</RecordFetcher>
	);
};

export default OrganisationFetcher;
