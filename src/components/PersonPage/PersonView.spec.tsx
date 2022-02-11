// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personObjectData';
import Identifiers from './Identifiers';
import ListWithLabel from './ListWithLabel';
import PersonView from './PersonView';

jest.mock('./Identifiers', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('./ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('PersonView', () => {
	it('should take a person', () => {
		render(<PersonView person={createMinimumPersonWithIdAndName()} />);
	});

	it('should render person name', () => {
		const { rerender } = render(<PersonView person={personWithDomain} />);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();

		rerender(
			<PersonView
				person={createMinimumPersonWithIdAndName(
					'someId',
					'SomeLastName',
					'SomeFirstName'
				)}
			/>
		);
		expect(
			screen.getByRole('heading', { name: 'SomeLastName, SomeFirstName' })
		).toBeInTheDocument();
	});

	it('should render title if not empty', () => {
		const person = createMinimumPersonWithIdAndName();
		person.academicTitle = 'someTitle';
		const { rerender } = render(<PersonView person={person} />);

		expect(screen.getByText(/someTitle/i)).toBeInTheDocument();

		person.academicTitle = 'someOtherTitle';

		rerender(<PersonView person={person} />);

		expect(screen.getByText(/someOtherTitle/i)).toBeInTheDocument();
	});

	it('should NOT render title if empty', () => {
		const person = createMinimumPersonWithIdAndName();
		person.academicTitle = '';
		render(<PersonView person={person} />);

		expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
	});

	it('should NOT render title if undefined', () => {
		const person = createMinimumPersonWithIdAndName();
		render(<PersonView person={person} />);

		expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
	});

	describe('alternative names', () => {
		it('should NOT call ListWithLabel with alternative names and no label if there are no alternative names', () => {
			render(<PersonView person={createMinimumPersonWithIdAndName()} />);

			expect(ListWithLabel).not.toHaveBeenCalled();
		});

		it('should call ListWithLabel with alternative names and no label if alternative names', () => {
			const person = createCompletePerson();
			render(<PersonView person={person} />);

			expect(ListWithLabel).toHaveBeenCalled();
			expect(ListWithLabel).toHaveBeenLastCalledWith(
				expect.objectContaining({
					label: '',
					list: [
						'someAlternativeFamilyName, someAlternativeGivenName',
						'someOtherAlternativeFamilyName, someOtherAlternativeGivenName',
					],
				}),
				expect.any(Object)
			);
		});
	});

	it('should call Identifiers with person', () => {
		render(<PersonView person={personWithDomain} />);

		expect(Identifiers).toHaveBeenCalledTimes(1);
		expect(Identifiers).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});
});
