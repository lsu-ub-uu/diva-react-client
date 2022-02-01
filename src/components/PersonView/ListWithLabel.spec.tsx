import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import ListWithLabel from './ListWithLabel';

const defaultList = ['someElement', 'someOtherElement'];

describe('ListWithLabel...', () => {
	it('takes a list of strings and a label', () => {
		render(<ListWithLabel list={defaultList} label="someLabel" />);
	});
	it('displays the label if the list is NOT empty', () => {
		render(<ListWithLabel list={defaultList} label="someLabel" />);
		expect(screen.getByText(/someLabel:/i)).toBeInTheDocument();

		render(<ListWithLabel list={defaultList} label="someOtherLabel" />);
		expect(screen.getByText(/someOtherLabel:/i)).toBeInTheDocument();
	});

	it('displays a UL element if the list is NOT empty', () => {
		render(<ListWithLabel list={defaultList} label="someLabel" />);

		expect(screen.getByRole('list')).toBeInTheDocument();
	});

	it('displays NO UL element if the list IS empty', () => {
		render(<ListWithLabel list={[]} label="someLabel" />);

		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('does not display the label if the list IS empty', () => {
		render(<ListWithLabel list={[]} label="someLabel" />);
		expect(screen.queryByText(/someLabel:/i)).not.toBeInTheDocument();
	});

	it('displays the list elements if the list is not empty', () => {
		render(<ListWithLabel list={defaultList} label="someLabel" />);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems).toHaveLength(2);

		expect(listItems[0]).toHaveTextContent('someElement');
		expect(listItems[1]).toHaveTextContent('someOtherElement');
	});
});
