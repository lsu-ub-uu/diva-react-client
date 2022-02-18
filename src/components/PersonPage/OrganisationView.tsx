import React from 'react';
import { Organisation } from '../../cora/types/Organisation';

const OrganisationView = function ({
	organisation,
}: {
	organisation: Organisation;
}) {
	return <p>{organisation.name}</p>;
};

export default OrganisationView;
