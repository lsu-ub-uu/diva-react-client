import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonDomainPart } from 'diva-cora-ts-api-wrapper';

import StringFormField from './StringFormField';
import { FormPerson } from '../../../types/FormPerson';
import PersonEdit from './PersonEdit';
import { createCompletePerson } from '../../../../testData/personObjectData';
import { renderWithRouter } from '../../../../test-utils';
import createOrganisationWithNameAndId from '../../../../testData/organisationObjectData';

const mockOnChange = jest.fn();
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

		screen.debug();
	});
});
