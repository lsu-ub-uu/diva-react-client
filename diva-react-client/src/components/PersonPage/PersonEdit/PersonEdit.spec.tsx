import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	List,
	Organisation,
	PersonDomainPart,
	searchOrganisationsByDomain,
} from 'diva-cora-ts-api-wrapper';
import { LOGIN_STATUS, useAuth } from '../../../context/AuthContext';
import StringFormField from './StringFormField';
import { FormPerson } from '../../../types/FormPerson';
import PersonEdit from './PersonEdit';
import { createCompletePerson } from '../../../../testData/personObjectData';
import { renderWithRouter } from '../../../../test-utils';
import createOrganisationWithNameAndId from '../../../../testData/organisationObjectData';

const mockAuth = jest.fn();
//jest.mock('diva-cora-ts-api-wrapper');

jest.mock('diva-cora-ts-api-wrapper', () => ({
	...jest.requireActual('diva-cora-ts-api-wrapper'),
	searchOrganisationsByDomain: jest.fn(),
}));

const mockSearcOrganisationByDomain =
	searchOrganisationsByDomain as jest.MockedFunction<
		typeof searchOrganisationsByDomain
	>;
jest.mock('../../../context/AuthContext', () => ({
	...jest.requireActual('../../../context/AuthContext'),
	useAuth: () => {
		return mockAuth();
	},
}));

beforeAll(() => {
	mockAuth.mockReturnValue({
		auth: {
			deleteUrl: '',
			idFromLogin: '',
			status: LOGIN_STATUS.LOGGED_IN,
			token: '',
			domain: 'uu',
		},
	});

	const organisations: Organisation[] = [
		{
			id: '1',
			recordType: 'organisation',
			name: 'uu',
			alternativeName: 'uppsala',
			organisationType: 'subOrganisation',
		},
	];

	const orgList = new List(organisations, 1, 2, 1);

	mockSearcOrganisationByDomain.mockResolvedValue(orgList);
});

describe('Person edit', () => {
	it('render person edit', () => {
		const somePersonDomainPart: PersonDomainPart = {
			id: 'someId',
			recordType: 'personDomainPart',
			identifiers: ['someIdentifier'],
			domain: 'someDomainId',
			affiliations: [],
		};

		const someOtherPersonDomainPart: PersonDomainPart = {
			id: 'someOtherId',
			recordType: 'personDomainPart',
			identifiers: ['someOtherIdentifier'],
			domain: 'someOtherDomainId',
			affiliations: [],
		};

		const parts: PersonDomainPart[] = [
			somePersonDomainPart,
			someOtherPersonDomainPart,
		];

		const org1 = createOrganisationWithNameAndId('someName', 'someId');
		const org2 = createOrganisationWithNameAndId('someName', 'someId');

		const person = createCompletePerson();

		renderWithRouter(
			<PersonEdit
				originalPerson={person}
				originalPersonDomainParts={parts}
				originalOrganisations={[org1, org2]}
			/>
		);

		const inputFields = screen.getAllByRole('textbox');
		const familyNameInput = inputFields[0];
		const givenNameInput = inputFields[1];
		userEvent.clear(familyNameInput);
		userEvent.type(familyNameInput, 'Anka');
		expect(familyNameInput).toHaveValue('Anka');

		userEvent.clear(givenNameInput);
		userEvent.type(givenNameInput, 'Kalle');
		expect(givenNameInput).toHaveValue('Kalle');
	});
});
