import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchButton from '../SearchButton';
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

describe('SearchButton.test', () => {
	it('It renders button "Sök"', () => {
		render(<SearchButton />);

		const searchButton = screen.getByRole('button', { name: 'Sök' });
		expect(searchButton).toBeInTheDocument();
		expect(searchButton).toHaveAttribute('type', 'submit');
	});
	it('The button labels the input field', () => {
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
	});
	it('Calls onSubmit if the submit-button is clicked', () => {
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

		const submitButton = screen.getByRole('button', { name: 'Sök' });

		userEvent.click(submitButton);

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
	it('Calls onSubmit if user presses "enter" within the input field', () => {
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

		userEvent.type(textInput, '{enter}');

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
});
