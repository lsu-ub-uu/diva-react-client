import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonDomainParts from './PersonDomainParts';
import { Auth } from '../../../context/types';
import { LOGIN_STATUS } from '../../../context/AuthContext';
import { FormPersonDomainPart } from '../../../types/FormPersonDomainPart';

const dispatchPersonDomainParts = jest.fn();

describe('Person domain parts', () => {
	it('renders person domain parts component', () => {
		const personDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',
			affiliations: [{ fromYear: '1922', untilYear: '2002', id: '1' }],
		};

		const personDomainPartIds = ['1'];

		const auth: Auth = {
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
			idFromLogin: 'someIdFromLogin',
			deleteUrl: 'someUrl',
			domain: 'uu',
		};

		const orgMap = new Map([['1', 'Uppsala']]);

		render(
			<PersonDomainParts
				personDomainPartIds={personDomainPartIds}
				personDomainParts={[personDomainPart]}
				auth={auth}
				organisationMap={orgMap}
				dispatchPersonDomainParts={dispatchPersonDomainParts}
			/>
		);
		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		userEvent.type(inputFields[1], 'a');
		userEvent.click(screen.getByTestId('trashbutton'));
		expect(dispatchPersonDomainParts).toHaveBeenCalledTimes(3);
	});

	it('renders person domain parts component 2', () => {
		const personDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',
			affiliations: [{ fromYear: '1922', untilYear: '2002', id: '1' }],
		};

		const personDomainPartIds = ['1'];

		const auth: Auth = {
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
			idFromLogin: 'someIdFromLogin',
			deleteUrl: 'someUrl',
			domain: 'uu2',
		};

		const orgMap = new Map([['2', 'Uppsala']]);

		render(
			<PersonDomainParts
				personDomainPartIds={personDomainPartIds}
				personDomainParts={[personDomainPart]}
				auth={auth}
				organisationMap={orgMap}
				dispatchPersonDomainParts={dispatchPersonDomainParts}
			/>
		);
	});

	it('renders person domain parts component 2', () => {
		const personDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',
			affiliations: [{ fromYear: '1922', untilYear: '2002', id: '2' }],
		};

		const personDomainPartIds = ['1'];

		const auth: Auth = {
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
			idFromLogin: 'someIdFromLogin',
			deleteUrl: 'someUrl',
			domain: 'uu',
		};

		const orgMap = new Map([['22', 'Uppsala']]);

		render(
			<PersonDomainParts
				personDomainPartIds={personDomainPartIds}
				personDomainParts={[personDomainPart]}
				auth={auth}
				organisationMap={orgMap}
				dispatchPersonDomainParts={dispatchPersonDomainParts}
			/>
		);
	});
});
