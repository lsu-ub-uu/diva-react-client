import { render, screen } from '@testing-library/react';
import React from 'react';
import { Organisation } from '../../cora/types/Organisation';
import OrganisationView from './OrganisationView';

const someObject: Organisation = {
	id: 'someId',
	recordType: 'organisation',
	name: 'someOrganisationName',
	alternativeName: 'someAlternativeOrganisationName',
	organisationType: 'subOrgansation',
};

const someOtherObject: Organisation = {
	id: 'someOtherId',
	recordType: 'organisation',
	name: 'someOtherOrganisationName',
	alternativeName: 'someOtherAlternatieOrganisationName',
	organisationType: 'subOrgansation',
};

describe('OrganisationView', () => {
	it('displays the organisations name', () => {
		render(<OrganisationView organisation={someObject} />);
		expect(screen.getByText(/someOrganisationName/)).toBeInTheDocument();

		render(<OrganisationView organisation={someOtherObject} />);
		expect(screen.getByText(/someOtherOrganisationName/)).toBeInTheDocument();
	});
});
