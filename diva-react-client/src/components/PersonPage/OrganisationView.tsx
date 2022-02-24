import React from 'react';
import { Organisation } from 'diva-cora-ts-api-wrapper';

const OrganisationView = function ({
	organisation,
}: {
	organisation: Organisation;
}) {
	return <p>{organisation.name}</p>;
};

export default OrganisationView;
