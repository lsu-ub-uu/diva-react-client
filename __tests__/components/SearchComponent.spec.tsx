import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchComponent from '../../src/components/SearchComponent';

const onValueChange = jest.fn();
const onSubmit = jest.fn();

describe('The SearchComponent', () => {
	it('Takes value:string and handlers onValueChange, onSubmit as props', () => {
		render(
			<SearchComponent
				value=""
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);
	});

	it('Renders an input field of type searchbox', () => {
		render(
			<SearchComponent
				value=""
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);

		const textInputs = screen.queryAllByRole('searchbox');
		expect(textInputs).toHaveLength(1);
	});

	it('Renders a button with text "Sök"', () => {
		render(
			<SearchComponent
				value=""
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);

		const submitButton = screen.getByRole('button', { name: 'Sök' });

		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toHaveAttribute('type', 'submit');
	});

	it('The button labes the input field', () => {
		render(
			<SearchComponent
				value=""
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);

		const textInput = screen.getByRole('searchbox');

		const textInputViaLabel = screen.getByLabelText('Sök');

		expect(textInput).toStrictEqual(textInputViaLabel);
	});

	it('Renders the value in the input field', () => {
		const { rerender } = render(
			<SearchComponent
				value="someSearchTerm"
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);
		const textInput = screen.getByRole('searchbox');

		rerender(
			<SearchComponent
				value="someOtherSearchTerm"
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);

		expect(textInput).toHaveValue('someOtherSearchTerm');
	});

	it('Calls onValueChange with the new value if the input field is changed', () => {
		render(
			<SearchComponent
				value="someSearchTerm"
				onValueChange={onValueChange}
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

	it('Calls onSubmit if the submit-button is clicked', () => {
		render(
			<SearchComponent
				value="someSearchTerm"
				onValueChange={onValueChange}
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
				value="someSearchTerm"
				onValueChange={onValueChange}
				onSubmit={onSubmit}
			/>
		);

		const textInput = screen.getByRole('searchbox');

		userEvent.type(textInput, '{enter}');

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
});
