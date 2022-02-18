import { render, screen } from '@testing-library/react';
import React from 'react';
import PersonDomainPartView from './PersonDomainPartView';
import { PersonDomainPart } from '../../cora/types/PersonDomainPart';
import ListWithLabel from './ListWithLabel';
import OrganisationFetcher from '../OrganisationFetcher';

jest.mock('./ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../OrganisationFetcher', () => {
	return jest.fn(() => {
		return <div />;
	});
});

const someBarePersonDomainPart: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
};

const somePersonDomainPart: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
	identifiers: ['someIdentifier'],
};

const someOtherPersonDomainPart: PersonDomainPart = {
	id: 'someOtherId',
	recordType: 'personDomainPart',
	identifiers: ['someOtherIdentifier'],
};

const somePersonDomainPartWithOrganisations: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
	affiliations: [
		{ id: 'someOrganisationId' },
		{ id: 'someOrganisationId2' },
		{ id: 'someOrganisationId3' },
	],
};

describe('PersonDomainPartView', () => {
	it('should take a personDomainPart', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);
	});
	it('should render "personDomainPart:id"', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

		expect(screen.getByText(/PersonDomainPart: someId/));
		render(
			<PersonDomainPartView personDomainPart={someOtherPersonDomainPart} />
		);

		expect(screen.getByText(/PersonDomainPart: someOtherId/));
	});

	it('should NOT call ListWithLabel with identifiers if identifiers undefined', () => {
		render(
			<PersonDomainPartView personDomainPart={someBarePersonDomainPart} />
		);

		expect(ListWithLabel).not.toHaveBeenCalled();
	});

	it('should call ListWithLabel with identifiers', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				list: somePersonDomainPart.identifiers,
				label: expect.any(String),
			}),
			expect.any(Object)
		);
		render(
			<PersonDomainPartView personDomainPart={someOtherPersonDomainPart} />
		);

		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				list: someOtherPersonDomainPart.identifiers,
				label: expect.any(String),
			}),
			expect.any(Object)
		);
	});

	it('should call ListWithLabel with identifiers', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				list: expect.any(Array),
				label: 'Lokal identifikator',
			}),
			expect.any(Object)
		);
	});

	describe('Organisations', () => {
		it('if there are no affiliations, should not call OrganisationFetcher', () => {
			render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);
			expect(OrganisationFetcher).not.toHaveBeenCalled();
		});

		it('if there ARE affiliations, should call OrganisationFetcher for each organisation', () => {
			render(
				<PersonDomainPartView
					personDomainPart={somePersonDomainPartWithOrganisations}
				/>
			);
			expect(OrganisationFetcher).toHaveBeenCalledTimes(3);
		});
		it('if there ARE affiliations, should call OrganisationFetcher with each organisationId', () => {
			render(
				<PersonDomainPartView
					personDomainPart={somePersonDomainPartWithOrganisations}
				/>
			);
			expect(OrganisationFetcher).toHaveBeenCalledTimes(3);
			expect(OrganisationFetcher).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					id: 'someOrganisationId',
				}),
				expect.any(Object)
			);
			expect(OrganisationFetcher).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					id: 'someOrganisationId2',
				}),
				expect.any(Object)
			);
			expect(OrganisationFetcher).toHaveBeenNthCalledWith(
				3,
				expect.objectContaining({
					id: 'someOrganisationId3',
				}),
				expect.any(Object)
			);
		});
	});
});
