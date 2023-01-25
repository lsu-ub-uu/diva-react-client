import React from 'react';
import { render, screen } from '@testing-library/react';
import ListWithLabel from '../ListWithLabel';

const defaultList = ['someElement', 'someOtherElement'];
const listContainingEmptyStrings = ['', 'someElement', '', 'someOtherElement'];

describe('ListWithLabel...', () => {
	it('takes a list of strings and a label', () => {
		render(
			<ListWithLabel
				list={defaultList}
				label='someLabel'
			/>
		);
	});

	it('takes an optional boolean omitEmptyStrings', () => {
		render(
			<ListWithLabel
				list={defaultList}
				label='someLabel'
				omitEmptyStrings
			/>
		);
	});

	describe('the label', () => {
		it('displays the label if the list is NOT empty', () => {
			render(
				<ListWithLabel
					list={defaultList}
					label='someLabel'
				/>
			);
			expect(screen.getByText(/someLabel:/i)).toBeInTheDocument();

			render(
				<ListWithLabel
					list={defaultList}
					label='someOtherLabel'
				/>
			);
			expect(screen.getByText(/someOtherLabel:/i)).toBeInTheDocument();
		});

		it('does not display the label if the list IS empty', () => {
			render(
				<ListWithLabel
					list={[]}
					label='someLabel'
				/>
			);
			expect(screen.queryByText(/someLabel:/i)).not.toBeInTheDocument();
		});

		it('does not display the label (or colon) if the label is an empty string', () => {
			render(
				<ListWithLabel
					list={defaultList}
					label=''
				/>
			);
			expect(screen.queryByText(/:/i)).not.toBeInTheDocument();
		});
	});

	it('displays a UL element if the list is NOT empty', () => {
		render(
			<ListWithLabel
				list={defaultList}
				label='someLabel'
			/>
		);

		expect(screen.getByRole('list')).toBeInTheDocument();
	});

	it('displays NO UL element if the list IS empty', () => {
		render(
			<ListWithLabel
				list={[]}
				label='someLabel'
			/>
		);

		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('displays the list elements if the list is not empty', () => {
		render(
			<ListWithLabel
				list={defaultList}
				label='someLabel'
			/>
		);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems).toHaveLength(2);

		expect(listItems[0]).toHaveTextContent('someElement');
		expect(listItems[1]).toHaveTextContent('someOtherElement');
	});

	it('displays empty strings if omitEmptyStrings has not been passed', () => {
		render(
			<ListWithLabel
				list={listContainingEmptyStrings}
				label='someLabel'
			/>
		);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems).toHaveLength(4);

		expect(listItems[0]).toHaveTextContent('');
		expect(listItems[1]).toHaveTextContent('someElement');
		expect(listItems[2]).toHaveTextContent('');
		expect(listItems[3]).toHaveTextContent('someOtherElement');
	});

	it('does NOT display empty strings if omitEmptyStrings HAS been passed', () => {
		render(
			<ListWithLabel
				list={listContainingEmptyStrings}
				label='someLabel'
				omitEmptyStrings
			/>
		);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems).toHaveLength(2);

		expect(listItems[0]).toHaveTextContent('someElement');
		expect(listItems[1]).toHaveTextContent('someOtherElement');
	});

	it('does not display strings only containing a comma', () => {
		render(
			<ListWithLabel
				list={[',', ' ,', ', ', ' , ']}
				label='someLabel'
			/>
		);

		const listItems = screen.queryAllByRole('listitem');

		expect(listItems).toHaveLength(0);
	});

	it('takes an optional parameter "tag"', () => {
		render(
			<ListWithLabel
				list={defaultList}
				label='someLabel'
				tag
			/>
		);
	});
});
