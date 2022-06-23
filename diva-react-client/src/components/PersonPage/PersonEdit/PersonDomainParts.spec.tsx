import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonDomainParts from './PersonDomainParts';
import { Auth } from '../../../context/types';
import { LOGIN_STATUS } from '../../../context/AuthContext';
import { FormPersonDomainPart } from '../../../types/FormPersonDomainPart';
import { PersonDomainPartActionType } from './personDomainPartReducer';

const dispatchPersonDomainParts = jest.fn();

const defaultAuth: Auth = {
	status: LOGIN_STATUS.LOGGED_IN,
	token: 'someToken',
	idFromLogin: 'someIdFromLogin',
	deleteUrl: 'someUrl',
	domain: 'uu',
};
describe('Person domain parts', () => {
	it('renders person domain parts component and calls dispatchPersonDomainParts with correct values', () => {
		const personDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',
			affiliations: [{ fromYear: '1922', untilYear: '2002', id: '1' }],
		};

		const personDomainPartIds = ['1'];

		const orgMap = new Map([['1', 'Uppsala']]);

		render(
			<PersonDomainParts
				personDomainPartIds={personDomainPartIds}
				personDomainParts={[personDomainPart]}
				auth={defaultAuth}
				organisationMap={orgMap}
				dispatchPersonDomainParts={dispatchPersonDomainParts}
			/>
		);
		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		userEvent.type(inputFields[1], 'a');
		userEvent.click(screen.getByTestId('trashbutton'));
		expect(dispatchPersonDomainParts).toHaveBeenCalledTimes(3);
		expect(dispatchPersonDomainParts).toHaveBeenNthCalledWith(1, {
			type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
			payload: {
				personDomainPartId: personDomainPart.id,
				affiliationId: '1',
				field: 'fromYear',
				value: '1922k',
			},
		});
		expect(dispatchPersonDomainParts).toHaveBeenNthCalledWith(2, {
			type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
			payload: {
				personDomainPartId: personDomainPart.id,
				affiliationId: '1',
				field: 'untilYear',
				value: '2002a',
			},
		});
		expect(dispatchPersonDomainParts).toHaveBeenNthCalledWith(3, {
			type: PersonDomainPartActionType.DELETE_AFFILIATION,
			payload: {
				personDomainPartId: personDomainPart.id,
				affiliationId: '1',
			},
		});
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

	it('Fallback to affiliationId if organisation not in map', () => {
		const personDomainPart: FormPersonDomainPart = {
			id: 'somePersonDomainPart',
			identifiers: ['1'],
			domain: 'uu',
			affiliations: [
				{ fromYear: '1922', untilYear: '2002', id: 'affiliationIdNotInMap' },
			],
		};

		const personDomainPartIds = ['somePersonDomainPart'];

		const orgMap = new Map([['2', 'Uppsala']]);

		render(
			<PersonDomainParts
				personDomainPartIds={personDomainPartIds}
				personDomainParts={[personDomainPart]}
				auth={defaultAuth}
				organisationMap={orgMap}
				dispatchPersonDomainParts={dispatchPersonDomainParts}
			/>
		);

		expect(screen.getByText('affiliationIdNotInMap')).toBeInTheDocument();
	});
});
