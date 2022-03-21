import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchComponent from './SearchComponent';

const onValueChange = jest.fn();
const onSubmit = jest.fn();
const onRowUpdate = jest.fn();

describe('The SearchComponent', () => {
	it('Takes value:string, rows:number and handlers onValueChange, onSubmit as props', () => {
		render(
			<SearchComponent
				value=""
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
				value=""
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

	it('Renders a button with text "Sök"', () => {
		render(
			<SearchComponent
				value=""
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
	});

	it('The button labels the input field', () => {
		render(
			<SearchComponent
				value=""
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

	it('Renders the value in the input field', () => {
		const { rerender } = render(
			<SearchComponent
				value="someSearchTerm"
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
				value="someOtherSearchTerm"
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
				value="someSearchTerm"
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

	it('Calls onSubmit if the submit-button is clicked', () => {
		render(
			<SearchComponent
				value="someSearchTerm"
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
				value="someSearchTerm"
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

	describe('row dropdown', () => {
		describe('appearance and config', () => {
			it('should exist and have label "Träffar per sida"', () => {
				render(
					<SearchComponent
						value="someSearchTerm"
						rows={10}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(screen.getByRole('combobox')).toEqual(
					screen.getByLabelText('Träffar per sida')
				);
			});
			it('should render the options passed into rowOptions', () => {
				let rowOptions = [10, 25, 50, 100];

				const { rerender } = render(
					<SearchComponent
						value="someSearchTerm"
						rows={10}
						rowOptions={rowOptions}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				rowOptions.forEach((option) => {
					const optionElement = screen.getByRole('option', {
						name: option.toString(),
					});
					expect(optionElement).toHaveAttribute('value', option.toString());
				});

				rowOptions = [20, 40, 60, 9999999];
				rerender(
					<SearchComponent
						value="someSearchTerm"
						rows={10}
						rowOptions={rowOptions}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);

				rowOptions.forEach((option) => {
					const optionElement = screen.getByRole('option', {
						name: option.toString(),
					});
					expect(optionElement).toHaveAttribute('value', option.toString());
				});
			});
			it('should pre-select the rows-value that has been provided', () => {
				const { rerender } = render(
					<SearchComponent
						value="someSearchTerm"
						rows={10}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(screen.getByRole('combobox')).toHaveValue('10');
				rerender(
					<SearchComponent
						value="someSearchTerm"
						rows={25}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(screen.getByRole('combobox')).toHaveValue('25');
			});
			it('should add a custom rows-value if not one of the defaults and if rows>1', () => {
				const { rerender } = render(
					<SearchComponent
						value="someSearchTerm"
						rows={1}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(
					screen.getByRole('option', {
						name: '1',
						selected: true,
					})
				).toBeInTheDocument();
				rerender(
					<SearchComponent
						value="someSearchTerm"
						rows={999}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(
					screen.queryByRole('option', {
						name: '1',
					})
				).not.toBeInTheDocument();
				expect(
					screen.getByRole('option', {
						name: '999',
						selected: true,
					})
				).toBeInTheDocument();
			});

			it('a custom row value should also be selected', () => {
				const { rerender } = render(
					<SearchComponent
						value="someSearchTerm"
						rows={99}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(screen.getByRole('combobox')).toHaveValue('99');

				rerender(
					<SearchComponent
						value="someSearchTerm"
						rows={20}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(screen.getByRole('combobox')).toHaveValue('20');
			});
			it('should set rows=50 if provided with rows<1, 50 should also be selected', () => {
				const { rerender } = render(
					<SearchComponent
						value="someSearchTerm"
						rows={0}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(
					screen.queryByRole('option', {
						name: '0',
					})
				).not.toBeInTheDocument();
				expect(
					screen.getByRole('option', {
						name: '50',
					})
				).toBeInTheDocument();
				expect(screen.getByRole('combobox')).toHaveValue('50');
				rerender(
					<SearchComponent
						value="someSearchTerm"
						rows={-1}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(
					screen.queryByRole('option', {
						name: '-1',
					})
				).not.toBeInTheDocument();
				expect(
					screen.getByRole('option', {
						name: '50',
					})
				).toBeInTheDocument();
				expect(screen.getByRole('combobox')).toHaveValue('50');
			});
		});
		describe('interaction', () => {
			it('if user selects other option, select should be updated', () => {
				render(
					<SearchComponent
						value="someSearchTerm"
						rows={10}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(screen.getByRole('combobox')).toHaveValue('10');
				userEvent.selectOptions(
					screen.getByRole('combobox'),
					screen.getByRole('option', { name: '25' })
				);
				expect(screen.getByRole('combobox')).toHaveValue('25');
			});
			it('if user selects other option, onRowUpdate should be called with new row value', () => {
				const { rerender } = render(
					<SearchComponent
						value="someSearchTerm"
						rows={10}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(onRowUpdate).not.toHaveBeenCalled();
				userEvent.selectOptions(
					screen.getByRole('combobox'),
					screen.getByRole('option', { name: '25' })
				);
				expect(onRowUpdate).toHaveBeenCalled();
				expect(onRowUpdate).toHaveBeenCalledWith(25);
				rerender(
					<SearchComponent
						value="someSearchTerm"
						rows={50}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(onRowUpdate).toHaveBeenCalledTimes(1);
				userEvent.selectOptions(
					screen.getByRole('combobox'),
					screen.getByRole('option', { name: '100' })
				);
				expect(onRowUpdate).toHaveBeenCalledTimes(2);
				expect(onRowUpdate).toHaveBeenCalledWith(100);
			});
		});
	});
});
