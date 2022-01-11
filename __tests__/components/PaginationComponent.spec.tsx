import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PaginationComponent from '../../src/components/PaginationComponent';

const onPaginationUpdate = jest.fn();

describe('paginationComponent', () => {
	it('should take props "start", "rows", "totalNumber" and "onPaginationUpdate"', () => {
		render(
			<PaginationComponent
				start={2}
				rows={5}
				totalNumber={200}
				onPaginationUpdate={onPaginationUpdate}
			/>
		);
	});

	describe('the next-button...', () => {
		it('should exist: display a button with text "Nästa >"', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
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
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const nextButton = screen.getByRole('button', { name: 'Nästa >' });
			userEvent.click(nextButton);

			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenCalledWith(7, 5);
		});

		it('should not be displayed if on the last page', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			const nextButtons = screen.queryAllByRole('button', { name: 'Nästa >' });
			expect(nextButtons).toHaveLength(0);
		});
	});

	describe('the last-button', () => {
		it('should exist: display a button with text "Sista >|"', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: 'Sista >|' });
			expect(lastButton).toBeInTheDocument();
		});

		it('should not be displayed if on the last page', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					totalNumber={100}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButtons = screen.queryAllByRole('button', { name: 'Sista >|' });
			expect(lastButtons).toHaveLength(0);
		});

		it('if the last-button is clicked, onPaginationUpdate should be called with a new "start" value and the same "rows" value', () => {
			let expectedRows = 5;
			const { rerender } = render(
				<PaginationComponent
					start={1}
					rows={expectedRows}
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
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			userEvent.click(lastButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(198, expectedRows);
		});
	});

	describe('the previous-button', () => {
		it('should exist: display a button with text "< Föregående"', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const previousButton = screen.getByRole('button', {
				name: '< Föregående',
			});
			expect(previousButton).toBeInTheDocument();
		});
		it('should not be displayed if on the first page', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					totalNumber={100}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const previousButtons = screen.queryAllByRole('button', {
				name: '< Föregående',
			});
			expect(previousButtons).toHaveLength(0);
		});
		it('if the previous-button is clicked, onPaginationUpdate should be called with a new "start" value and the same "rows" value', () => {
			let expectedRows = 100;
			const { rerender } = render(
				<PaginationComponent
					start={101}
					rows={expectedRows}
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
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			userEvent.click(previousButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);
		});
	});

	describe('the first-button', () => {
		it('should exist: display a button with text "|< Första"', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|< Första' });
			expect(firstButton).toBeInTheDocument();
		});

		it('should not be displayed if on the first page', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const allPossibleFirstButtons = screen.queryAllByRole('button', {
				name: '|< Första',
			});
			expect(allPossibleFirstButtons).toHaveLength(0);
		});

		it('if the first-button is clicked, onPaginationUpdate should be called with start=1 and the same "rows" value', () => {
			let expectedRows = 5;
			const { rerender } = render(
				<PaginationComponent
					start={6}
					rows={expectedRows}
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
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			userEvent.click(firstButton);
			expect(onPaginationUpdate).toHaveBeenCalledTimes(3);
			expect(onPaginationUpdate).toHaveBeenLastCalledWith(1, expectedRows);
		});
	});

	it.todo('there should be a button to jump to the first page');
});
