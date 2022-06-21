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
});
