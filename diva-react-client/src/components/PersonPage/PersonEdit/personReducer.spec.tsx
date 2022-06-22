import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import { AlternativeNames } from './AlternativeNames';
import {
	PersonDomainpartAction,
	PersonDomainPartActionType,
} from './personDomainPartReducer';
import { personDomainPartReducer } from './personDomainPartReducer';
import { PersonAction, PersonActionType, personReducer } from './personReducer';
import { createCompleteFormPerson } from '../../../../testData/personObjectData';

import { FormPerson } from '../../../types/FormPerson';

describe('personReducer.spec', () => {
	it('add array object', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.ADD_ARRAY_OBJECT,
			payload: {
				emptyObject: { linkTitle: 'foo', URL: 'foo.se' },
				field: 'externalURLs' as keyof FormPerson,
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified: FormPerson = {
			...initialFormPerson,
			externalURLs: [
				...initialFormPerson.externalURLs,
				{ content: { linkTitle: 'foo', URL: 'foo.se' }, repeatId: 2 },
			],
		};

		expect(formPerson).toStrictEqual(formPersonModified);
	});

	it('add string field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.ADD_ARRAY_STRING_FIELD,
			payload: {
				field: 'orcids' as keyof FormPerson,
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		initialFormPerson.orcids.push('');

		expect(formPerson).toStrictEqual(initialFormPerson);
	});

	it('update string field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_STRING_FIELD,
			payload: {
				value: 'doktor',
				field: 'academicTitle' as keyof FormPerson,
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified: FormPerson = initialFormPerson;
		formPersonModified.academicTitle = 'doktor';

		expect(formPerson).toStrictEqual(formPersonModified);
	});

	it('update array object field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
			payload: {
				index: 2,
				field: 'alternativeNames',
				childField: 'givenName' as keyof FormPerson,
				value: 'Ada',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.alternativeNames[0]).toStrictEqual({
			content: {
				familyName: 'someAlternativeFamilyName',
				givenName: 'someAlternativeGivenName',
			},
			repeatId: 0,
		});
	});

	it('toggle public', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.public = 'yes';

		const personAction: PersonAction = {
			type: PersonActionType.TOGGLE_PUBLIC,
			payload: {
				field: 'public',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;
		formPerson.public = 'no';

		expect(formPersonModified.public).toBe('no');
	});

	it('update array string field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.domains = ['uu', 'slu'];

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
			payload: {
				index: 1,
				field: 'domains',
				value: 'su',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.domains[1]).toBe('su');
	});
});
