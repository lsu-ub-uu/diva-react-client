import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlternativeNames } from './AlternativeNames';
import {
	PersonDomainpartAction,
	PersonDomainPartActionType,
} from './personDomainPartReducer';
import { personDomainPartReducer } from './personDomainPartReducer';
import { PersonActionType, personReducer } from './personReducer';
import {
	FormPersonDomainPart,
	FormAffiliationLink,
} from '../../../types/FormPersonDomainPart';

describe('personDomainPartReducer.spec', () => {
	it('addAffiliation', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: 'someId',
			identifiers: ['someId'],
			domain: 'uu',

			affiliations: [{ id: '1', fromYear: '1902', untilYear: '2002' }],
		};

		const formPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.ADD_AFFILIATION,
			payload: {
				personDomainPartId: '1',
				affiliationId: '1',
			},
		};
		const reducer = personDomainPartReducer(
			formPersonDomainParts,
			personDomainPartAction
		);

		console.log(reducer);
	});
});
