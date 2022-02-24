import React from 'react';
import OrganisationView from './PersonPage/OrganisationView';
import { Organisation } from '../cora/types/Organisation';
import RecordFetcher from './RecordFetcher';
import { RecordType } from '../cora/types/Record';

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
