import { render, screen } from '@testing-library/react';
import React from 'react';
import PersonDomainPartView from './PersonDomainPartView';
import { PersonDomainPart } from '../../cora/types/PersonDomainPart';
import ListWithLabel from './ListWithLabel';

jest.mock('./ListWithLabel', () => {
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
});
