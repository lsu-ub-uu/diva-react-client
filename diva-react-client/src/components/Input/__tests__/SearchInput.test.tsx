import React from 'react';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import SearchComponent from '../../SearchComponent';

const onValueChange = jest.fn();
const onSubmit = jest.fn();
const onRowUpdate = jest.fn();

let newRows = '25';

jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	Select: jest.fn((props: any) => {
		const { onChange } = props;
		return (
			<button
				type='button'
				onClick={() => {
					onChange({
						target: { value: newRows },
					});
				}}
			>
				onChange
			</button>
		);
	}),
}));

beforeEach(() => {
	newRows = '25';
});

describe('The SearchComponent', () => {
	it('Takes value:string, rows:number and handlers onValueChange, onSubmit as props', () => {
		render(
			<SearchComponent
				value=''
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);
	});

	it('Renders an input field of type searchbox', () => {
		render(
			<SearchComponent
				value=''
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);

		const textInputs = screen.queryAllByRole('searchbox');
		expect(textInputs).toHaveLength(1);
	});

	/* it('Renders a button with text "Sök"', () => {
		render(
			<SearchComponent
				value=''
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);

		const submitButton = screen.getByRole('button', { name: 'Sök' });

		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toHaveAttribute('type', 'submit');
	}); */

	/* it('The button labels the input field', () => {
		render(
			<SearchComponent
				value=''
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);

		const textInput = screen.getByRole('searchbox');

		const textInputViaLabel = screen.getByLabelText('Sök');

		expect(textInput).toStrictEqual(textInputViaLabel);
	}); */

	it('Renders the value in the input field', () => {
		const { rerender } = render(
			<SearchComponent
				value='someSearchTerm'
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);
		const textInput = screen.getByRole('searchbox');

		rerender(
			<SearchComponent
				value='someOtherSearchTerm'
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);

		expect(textInput).toHaveValue('someOtherSearchTerm');
	});

	it('Calls onValueChange with the new value if the input field is changed', () => {
		render(
			<SearchComponent
				value='someSearchTerm'
				rows={10}
				rowOptions={[10, 25, 50, 100]}
				onValueChange={onValueChange}
				onRowUpdate={onRowUpdate}
				onSubmit={onSubmit}
			/>
		);
		const textInput = screen.getByRole('searchbox');

		userEvent.type(textInput, 'b');

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenLastCalledWith('someSearchTermb');

		userEvent.clear(textInput);
		expect(onValueChange).toHaveBeenLastCalledWith('');
	});
});
