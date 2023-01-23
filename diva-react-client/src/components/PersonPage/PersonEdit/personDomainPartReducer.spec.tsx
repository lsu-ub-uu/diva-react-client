import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import { AlternativeNames } from './AlternativeNames';
import {
	PersonDomainpartAction,
	PersonDomainPartActionType,
	personDomainPartReducer,
} from './personDomainPartReducer';
import { PersonActionType, personReducer } from './personReducer';
import {
	FormPersonDomainPart,
	FormAffiliationLink,
} from '../../../types/FormPersonDomainPart';

describe('personDomainPartReducer.spec', () => {
	it('addAffiliation', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
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

		expect(reducer).toStrictEqual([
			{
				id: '1',
				identifiers: ['1'],
				domain: 'uu',
				affiliations: [
					{ id: '1', fromYear: '1902', untilYear: '2002' },
					{ id: '1', fromYear: '', untilYear: '' },
				],
			},
		]);
	});

	it('deleteAffiliation', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',

			affiliations: [{ id: '1', fromYear: '1902', untilYear: '2002' }],
		};

		const formPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.DELETE_AFFILIATION,
			payload: {
				personDomainPartId: '1',
				affiliationId: '1',
			},
		};
		const reducer = personDomainPartReducer(
			formPersonDomainParts,
			personDomainPartAction
		);

		expect(reducer).toStrictEqual([
			{
				id: '1',
				identifiers: ['1'],
				domain: 'uu',
				affiliations: [],
			},
		]);
	});

	it('set affiliation field', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',

			affiliations: [{ id: '1', fromYear: '1902', untilYear: '2002' }],
		};

		const formPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
			payload: {
				field: 'foo',
				value: 'slu',
				personDomainPartId: '1',
				affiliationId: '1',
			},
		};
		const reducer = personDomainPartReducer(
			formPersonDomainParts,
			personDomainPartAction
		);

		expect(reducer).toStrictEqual([
			{
				id: '1',
				domain: 'uu',
				identifiers: ['1'],
				affiliations: [
					{
						id: '1',
						fromYear: '1902',
						untilYear: '2002',
						foo: 'slu',
					},
				],
			},
		]);
	});

	it('state should remain unchanged when there is no matching person domain part when calling add affiliaton', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '12',
			identifiers: ['2'],
			domain: 'uu',

			affiliations: [{ id: '1', fromYear: '1902', untilYear: '2002' }],
		};

		const initialFormPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.ADD_AFFILIATION,
			payload: {
				personDomainPartId: '14',
				affiliationId: '1',
			},
		};
		const reducer = personDomainPartReducer(
			initialFormPersonDomainParts,
			personDomainPartAction
		);

		expect(reducer).toStrictEqual(initialFormPersonDomainParts);
	});

	it('state should remain unchanged when there is no matching person domain part when calling delete affiliaton', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',

			affiliations: [{ id: '1', fromYear: '1902', untilYear: '2002' }],
		};

		const inititalFormPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.DELETE_AFFILIATION,
			payload: {
				personDomainPartId: '12',
				affiliationId: '12',
			},
		};
		const reducer = personDomainPartReducer(
			inititalFormPersonDomainParts,
			personDomainPartAction
		);

		expect(reducer).toStrictEqual(inititalFormPersonDomainParts);
	});

	it('state should remain unchanged when there is no matchinga affiliation when calling set affiliation field', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',

			affiliations: [{ id: '2', fromYear: '1902', untilYear: '2002' }],
		};

		const initialFormPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
			payload: {
				field: 'fromYears',
				value: '1905',
				personDomainPartId: '1',
				affiliationId: '35',
			},
		};
		const personDomainParts: FormPersonDomainPart[] =
			personDomainPartReducer(
				initialFormPersonDomainParts,
				personDomainPartAction
			);

		expect(personDomainParts).toStrictEqual(initialFormPersonDomainParts);
	});

	it('state should remain unchanged when there is no matching person domain part when calling set affiliation field', () => {
		const someFormPersonDomainPart: FormPersonDomainPart = {
			id: '1',
			identifiers: ['1'],
			domain: 'uu',

			affiliations: [{ id: '2', fromYear: '1902', untilYear: '2002' }],
		};

		const initialFormPersonDomainParts: FormPersonDomainPart[] = [
			someFormPersonDomainPart,
		];

		const personDomainPartAction: PersonDomainpartAction = {
			type: PersonDomainPartActionType.SET_AFFILIATION_FIELD,
			payload: {
				field: 'fromYears',
				value: '1905',
				personDomainPartId: '12',
				affiliationId: '2',
			},
		};
		const personDomainParts: FormPersonDomainPart[] =
			personDomainPartReducer(
				initialFormPersonDomainParts,
				personDomainPartAction
			);

		expect(personDomainParts).toStrictEqual(initialFormPersonDomainParts);
	});
});
