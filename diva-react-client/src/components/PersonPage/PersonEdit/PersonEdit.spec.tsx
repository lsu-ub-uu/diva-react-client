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
import {
	createCompletePerson,
	createMinimumFormPersonWithIdAndName,
	createMinimumPersonWithIdAndName,
} from '../../../../testData/personObjectData';
import { renderWithRouter } from '../../../../test-utils';
import createOrganisationWithNameAndId from '../../../../testData/organisationObjectData';
import { act } from 'react-dom/test-utils';
import { Action } from 'grommet-icons';

const mockAuth = jest.fn();

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
		const org2 = createOrganisationWithNameAndId(
			'someOtherName',
			'someOtherId'
		);

		const person = createCompletePerson();
		const person2 = createMinimumFormPersonWithIdAndName();

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

		const academicTitle = inputFields[6];
		userEvent.clear(familyNameInput);
		userEvent.type(familyNameInput, 'Anka');
		expect(familyNameInput).toHaveValue('Anka');

		userEvent.clear(givenNameInput);
		userEvent.type(givenNameInput, 'Kalle');
		expect(givenNameInput).toHaveValue('Kalle');

		userEvent.clear(academicTitle);
		userEvent.type(academicTitle, 'Professor');
		expect(academicTitle).toHaveValue('Professor');
	});

	it('render person edit2', () => {
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
		const org2 = createOrganisationWithNameAndId(
			'someOtherName',
			'someOtherId'
		);

		const person2 = createMinimumPersonWithIdAndName();
		person2.orcids = [''];
		renderWithRouter(
			<PersonEdit
				originalPerson={person2}
				originalPersonDomainParts={parts}
				originalOrganisations={[org1, org2]}
			/>
		);

		const inputFields = screen.getAllByRole('textbox');
		const yearOfBirth = inputFields[7];

		userEvent.clear(yearOfBirth);
		userEvent.type(yearOfBirth, '1945');
		screen.debug();
		expect(yearOfBirth).toHaveValue('1945');
		userEvent.clear(yearOfBirth);
		userEvent.type(yearOfBirth, '');
		expect(yearOfBirth).toHaveValue('');

		const submit = screen.getAllByRole('button');
		console.log(submit);
		userEvent.click(submit[4]);
	});
});
