// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personData';
import Identifiers from './Identifiers';
import PersonView from './PersonView';

jest.mock('./Identifiers', () => {
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
			screen.getByText(/SomeLastName, SomeFirstName/i)
		).toBeInTheDocument();
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
