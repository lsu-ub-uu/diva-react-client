import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PaginationComponent from '../../src/components/PaginationComponent';

const onPaginationUpdate = jest.fn();

describe('paginationComponent', () => {
	it('should take props "start", "rows", "toNumber", "totalNumber" and "onPaginationUpdate"', () => {
		render(
			<PaginationComponent
				start={2}
				rows={5}
				toNumber={7}
				totalNumber={200}
				onPaginationUpdate={onPaginationUpdate}
			/>
		);
	});

	describe('feedback about the current page and result set', () => {
		it('should display which results the user is currently seeing and how many results there are', () => {
			const { rerender } = render(
				<PaginationComponent
					start={2}
					rows={5}
					toNumber={6}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			expect(screen.getByText(/2-6 av 200/i)).toBeInTheDocument();

			rerender(
				<PaginationComponent
					start={123}
					rows={33}
					toNumber={155}
					totalNumber={2344}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			expect(screen.getByText(/123-155 av 2344/i)).toBeInTheDocument();

			rerender(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={100}
					totalNumber={300}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			expect(screen.getByText(/1-100 av 300/i)).toBeInTheDocument();

			rerender(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={150}
					totalNumber={150}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			expect(screen.getByText(/101-150 av 150/i)).toBeInTheDocument();
		});
	});

	describe('row dropdown', () => {
		describe('appearance and config', () => {
			it('should exist and have label "Träffar per sida"', () => {
				render(
					<PaginationComponent
						start={2}
						rows={5}
						toNumber={7}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(screen.getByRole('combobox')).toEqual(
					screen.getByLabelText('Träffar per sida')
				);
			});

			it('should have options 10, 25, 50, 100', () => {
				render(
					<PaginationComponent
						start={2}
						rows={5}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				const options = [10, 25, 50, 100];

				options.forEach((option) => {
					const optionElement = screen.getByRole('option', {
						name: option.toString(),
					});
					expect(optionElement).toHaveAttribute('value', option.toString());
				});
			});

			it('should pre-select the rows-value that has been provided', () => {
				const { rerender } = render(
					<PaginationComponent
						start={1}
						rows={10}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(screen.getByRole('combobox')).toHaveValue('10');

				rerender(
					<PaginationComponent
						start={1}
						rows={25}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(screen.getByRole('combobox')).toHaveValue('25');
			});

			it('should add a custom rows-value between 1 and 100 if not one of the defaults', () => {
				const { rerender } = render(
					<PaginationComponent
						start={1}
						rows={1}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(
					screen.getByRole('option', {
						name: '1',
						selected: true,
					})
				).toBeInTheDocument();

				rerender(
					<PaginationComponent
						start={1}
						rows={99}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(
					screen.queryByRole('option', {
						name: '1',
					})
				).not.toBeInTheDocument();

				expect(
					screen.getByRole('option', {
						name: '99',
						selected: true,
					})
				).toBeInTheDocument();
			});

			it('should set rows=50 if provided with rows>100 or rows<1', () => {
				const { rerender } = render(
					<PaginationComponent
						start={1}
						rows={0}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
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
						selected: true,
					})
				).toBeInTheDocument();

				rerender(
					<PaginationComponent
						start={1}
						rows={101}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(
					screen.queryByRole('option', {
						name: '101',
					})
				).not.toBeInTheDocument();

				expect(
					screen.getByRole('option', {
						name: '50',
						selected: true,
					})
				).toBeInTheDocument();
			});
		});

		describe('interaction', () => {
			it('if user selects other option, select should be updated', () => {
				render(
					<PaginationComponent
						start={1}
						rows={10}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(screen.getByRole('combobox')).toHaveValue('10');

				userEvent.selectOptions(
					screen.getByRole('combobox'),

					screen.getByRole('option', { name: '25' })
				);

				expect(screen.getByRole('combobox')).toHaveValue('25');
			});

			it('if user selects other option, onPaginationUpdate should be called with new row value', () => {
				const { rerender } = render(
					<PaginationComponent
						start={1}
						rows={10}
						toNumber={0}
						totalNumber={200}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(onPaginationUpdate).not.toHaveBeenCalled();

				userEvent.selectOptions(
					screen.getByRole('combobox'),

					screen.getByRole('option', { name: '25' })
				);

				expect(onPaginationUpdate).toHaveBeenCalled();
				expect(onPaginationUpdate).toHaveBeenCalledWith(1, 25);

				rerender(
					<PaginationComponent
						start={20}
						rows={50}
						toNumber={0}
						totalNumber={5500}
						onPaginationUpdate={onPaginationUpdate}
					/>
				);

				expect(onPaginationUpdate).toHaveBeenCalledTimes(1);

				userEvent.selectOptions(
					screen.getByRole('combobox'),

					screen.getByRole('option', { name: '100' })
				);
				expect(onPaginationUpdate).toHaveBeenCalledTimes(2);
				expect(onPaginationUpdate).toHaveBeenCalledWith(20, 100);
			});
		});
	});

	describe('the next-button...', () => {
		it('should exist: display a button with text "Nästa >"', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const nextButton = screen.getByRole('button', { name: 'Nästa >' });
			expect(nextButton).toBeInTheDocument();
		});

		it('if the next-button is clicked, onPaginationUpdate should be called with a new "start" value and the same "rows" value', () => {
			render(
				<PaginationComponent
					start={2}
					rows={5}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const nextButton = screen.getByRole('button', { name: 'Nästa >' });
			userEvent.click(nextButton);

			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenCalledWith(7, 5);
		});

		it('should be disabled if on the last page', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			const nextButton = screen.getByRole('button', { name: 'Nästa >' });
			expect(nextButton).toBeDisabled();
		});
	});

	describe('the last-button...', () => {
		it('should exist: display a button with text "Sista >|"', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: 'Sista >|' });
			expect(lastButton).toBeInTheDocument();
		});

		it('should be disabled if on the last page', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={100}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: 'Sista >|' });
			expect(lastButton).toBeDisabled();
		});

		it('if the last-button is clicked, onPaginationUpdate should be called with a new "start" value and the same "rows" value', () => {
			let expectedRows = 5;
			const { rerender } = render(
				<PaginationComponent
					start={1}
					rows={expectedRows}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: 'Sista >|' });
			userEvent.click(lastButton);

			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(21, expectedRows);

			expectedRows = 6;
			rerender(
				<PaginationComponent
					start={2}
					rows={expectedRows}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			userEvent.click(lastButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(2);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(20, expectedRows);

			expectedRows = 25;
			rerender(
				<PaginationComponent
					start={123}
					rows={expectedRows}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			userEvent.click(lastButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(198, expectedRows);
		});
	});

	describe('the previous-button...', () => {
		it('should exist: display a button with text "< Föregående"', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const previousButton = screen.getByRole('button', {
				name: '< Föregående',
			});
			expect(previousButton).toBeInTheDocument();
		});
		it('should be disabled if on the first page', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={100}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const previousButton = screen.getByRole('button', {
				name: '< Föregående',
			});
			expect(previousButton).toBeDisabled();
		});
		it('if the previous-button is clicked, onPaginationUpdate should be called with a new "start" value and the same "rows" value', () => {
			let expectedRows = 100;
			const { rerender } = render(
				<PaginationComponent
					start={101}
					rows={expectedRows}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const previousButton = screen.getByRole('button', {
				name: '< Föregående',
			});
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);

			expectedRows = 6;
			rerender(
				<PaginationComponent
					start={13}
					rows={expectedRows}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(2);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(7, expectedRows);

			expectedRows = 25;
			rerender(
				<PaginationComponent
					start={123}
					rows={expectedRows}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(98, expectedRows);
		});

		it('if the previous-button is clicked, and start<rows, start should be set to 1', () => {
			let expectedRows = 100;
			const { rerender } = render(
				<PaginationComponent
					start={50}
					rows={expectedRows}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const previousButton = screen.getByRole('button', {
				name: '< Föregående',
			});
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);

			expectedRows = 6;
			rerender(
				<PaginationComponent
					start={2}
					rows={expectedRows}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(2);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);

			expectedRows = 25;
			rerender(
				<PaginationComponent
					start={23}
					rows={expectedRows}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);
		});
	});

	describe('the first-button...', () => {
		it('should exist: display a button with text "|< Första"', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|< Första' });
			expect(firstButton).toBeInTheDocument();
		});

		it('should be disabled if on the first page', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|< Första' });
			expect(firstButton).toBeDisabled();
		});

		it('if the first-button is clicked, onPaginationUpdate should be called with start=1 and the same "rows" value', () => {
			let expectedRows = 5;
			const { rerender } = render(
				<PaginationComponent
					start={6}
					rows={expectedRows}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|< Första' });
			userEvent.click(firstButton);

			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);

			expectedRows = 6;
			rerender(
				<PaginationComponent
					start={2}
					rows={expectedRows}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			userEvent.click(firstButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(2);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);

			expectedRows = 25;
			rerender(
				<PaginationComponent
					start={123}
					rows={expectedRows}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			userEvent.click(firstButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);
		});
	});
});
