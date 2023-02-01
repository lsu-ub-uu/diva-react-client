import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
/* import SearchComponent from '../../SearchComponent'; */
import SearchComponent from '../../SearchComponent';
import Select from '../Select';

const onValueChange = jest.fn();
const onSubmit = jest.fn();
const onRowUpdate = jest.fn();

let newRows = '25';
const options: string[] = ['10', '25', '50', '100'];
const onChange = jest.fn();

/* jest.mock('grommet', () => ({
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
})); */

beforeEach(() => {
	newRows = '25';
});

describe('row dropdown', () => {
	describe('appearance and config', () => {
		it('should exist and have label "Träffar per sida"', () => {
			render(
				/*                 <SearchComponent
                value='someSearchTerm'
                rows={10}
                rowOptions={[10, 25, 50, 100]}
                onValueChange={onValueChange}
                onRowUpdate={onRowUpdate}
                onSubmit={onSubmit}
            /> */

				<Select
					id='rows-input'
					aria-labelledby='rows-label'
					options={options}
					value='10'
					onChange={onChange}
					labelText='Träffar per sida'
				/>
			);
			expect(screen.getByRole('combobox', { name: 'Träffar per sida' }));
		});
		xit('should call Select with parameters', () => {
			let rowOptions = [10, 25, 50, 100];

			render(
				<Select
					id='rows-input'
					aria-labelledby='rows-label'
					options={options}
					value='10'
					onChange={onChange}
					labelText='Träffar per sida'
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

			/* rowOptions = [20, 40, 60, 9999999];
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
			); */
		});
		xit('should add a custom rows-value if not one of the defaults and if rows>1', () => {
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
		xit('should set rows=50 if provided with rows<1, 50 should also be selected', () => {
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
			userEvent.selectOptions(
				// Find the select element
				screen.getByRole('combobox'),
				// Find and select the Ireland option
				screen.getByRole('option', { name: '25' })
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

			userEvent.click(screen.getByRole('button', { name: 'onChange' }));

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
			userEvent.click(screen.getByRole('button', { name: 'onChange' }));

			expect(onRowUpdate).toHaveBeenCalledTimes(2);
			expect(onRowUpdate).toHaveBeenCalledWith(100);
		});
	});
});
