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
	it.todo(
		'default values for "start", "rows" and totalNumber should be 1, 100'
	);

	describe('the next-button...', () => {
		it('should exist: display a button with text "Nästa >"', () => {
			render(
				<PaginationComponent
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

		it('if the next-button is clicked, onPaginationUpdate should be called with "start"=1 value and "rows"=100, if neither start nor rows were specified', () => {
			render(
				<PaginationComponent
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const nextButton = screen.getByRole('button', { name: 'Nästa >' });
			userEvent.click(nextButton);

			expect(onPaginationUpdate).toHaveBeenCalledTimes(1);
			expect(onPaginationUpdate).toHaveBeenCalledWith(101, 100);
		});

		it('should be disabled if the combination of start, rows and totalNumber indicate that the user is on the last page', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			const nextButton = screen.getByRole('button', { name: 'Nästa >' });
			expect(nextButton).toBeInTheDocument();
			expect(nextButton).toBeDisabled();
		});
	});

	it.todo('there should be a button to jump to the last page');
	it.todo('there should be a button to jump to the first page');
});
