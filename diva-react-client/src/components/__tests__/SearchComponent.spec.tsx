import React from 'react';
import { render, screen } from '@testing-library/react';
import { Select } from 'grommet';
import userEvent from '@testing-library/user-event';
import SearchComponent from '../SearchComponent';

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

	it('Renders a button with text "Sök"', () => {
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

	describe('row dropdown', () => {
		describe('appearance and config', () => {
			it('should exist and have label "Träffar per sida"', () => {
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
				expect(screen.getByText('Träffar per sida')).toHaveAttribute(
					'id',
					'rows-label'
				);
			});
			it('should call Select with parameters', () => {
				let rowOptions = [10, 25, 50, 100];

				const { rerender } = render(
					<SearchComponent
						value='someSearchTerm'
						rows={10}
						rowOptions={rowOptions}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);

				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '10',
						onChange: expect.any(Function),
						options: rowOptions.map((option) => option.toString()),
					}),
					expect.any(Object)
				);

				rowOptions = [20, 40, 60, 9999999];
				rerender(
					<SearchComponent
						value='someSearchTerm'
						rows={20}
						rowOptions={rowOptions}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);

				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '20',
						onChange: expect.any(Function),
						options: rowOptions.map((option) => option.toString()),
					}),
					expect.any(Object)
				);
			});
			it('should add a custom rows-value if not one of the defaults and if rows>1', () => {
				const { rerender } = render(
					<SearchComponent
						value='someSearchTerm'
						rows={1}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '1',
						onChange: expect.any(Function),
						options: [10, 25, 50, 100, 1].map((option) =>
							option.toString()
						),
					}),
					expect.any(Object)
				);
				rerender(
					<SearchComponent
						value='someSearchTerm'
						rows={999}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '999',
						onChange: expect.any(Function),
						options: [10, 25, 50, 100, 999].map((option) =>
							option.toString()
						),
					}),
					expect.any(Object)
				);
			});
			it('should set rows=50 if provided with rows<1, 50 should also be selected', () => {
				const { rerender } = render(
					<SearchComponent
						value='someSearchTerm'
						rows={0}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '50',
						onChange: expect.any(Function),
						options: [10, 25, 50, 100].map((option) =>
							option.toString()
						),
					}),
					expect.any(Object)
				);
				rerender(
					<SearchComponent
						value='someSearchTerm'
						rows={-1}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '50',
						onChange: expect.any(Function),
						options: [10, 25, 50, 100].map((option) =>
							option.toString()
						),
					}),
					expect.any(Object)
				);
			});
		});
		describe('interaction', () => {
			it('if user selects other option, select should be updated', () => {
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

				userEvent.click(
					screen.getByRole('button', { name: 'onChange' })
				);

				expect(Select).toHaveBeenLastCalledWith(
					expect.objectContaining({
						id: 'rows-input',
						'aria-labelledby': 'rows-label',
						value: '25',
						onChange: expect.any(Function),
						options: [10, 25, 50, 100].map((option) =>
							option.toString()
						),
					}),
					expect.any(Object)
				);
			});
			it('if user selects other option, onRowUpdate should be called with new row value', () => {
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
				expect(onRowUpdate).not.toHaveBeenCalled();

				userEvent.click(
					screen.getByRole('button', { name: 'onChange' })
				);

				expect(onRowUpdate).toHaveBeenCalled();
				expect(onRowUpdate).toHaveBeenCalledWith(25);
				rerender(
					<SearchComponent
						value='someSearchTerm'
						rows={50}
						rowOptions={[10, 25, 50, 100]}
						onValueChange={onValueChange}
						onRowUpdate={onRowUpdate}
						onSubmit={onSubmit}
					/>
				);
				expect(onRowUpdate).toHaveBeenCalledTimes(1);

				newRows = '100';
				userEvent.click(
					screen.getByRole('button', { name: 'onChange' })
				);

				expect(onRowUpdate).toHaveBeenCalledTimes(2);
				expect(onRowUpdate).toHaveBeenCalledWith(100);
			});
		});
	});
});
