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
	it.todo('default values for "start" and "rows" should be 1 and 100');

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

	// it('if the button is clicked, the "start" parameter should be increased by "rows"', async () => {
	//     render(
	//         <MemoryRouter
	//             initialEntries={['?searchTerm=someSearchTerm&start=1&rows=5']}
	//         >
	//             <PersonSearch />
	//         </MemoryRouter>
	//     );

	//     await waitFor(() => {
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
	//             'someSearchTerm',
	//             1,
	//             5
	//         );
	//     });

	//     const nextButton = screen.getByRole('button', { name: 'Nästa >' });

	//     userEvent.click(nextButton);

	//     await waitFor(() => {
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
	//             'someSearchTerm',
	//             6,
	//             5
	//         );
	//     });
	// });

	// it('if the button is clicked, the "start" parameter should be increased by "rows" 2', async () => {
	//     render(
	//         <MemoryRouter
	//             initialEntries={['?searchTerm=someSearchTerm&start=2&rows=10']}
	//         >
	//             <PersonSearch />
	//         </MemoryRouter>
	//     );

	//     await waitFor(() => {
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
	//             'someSearchTerm',
	//             2,
	//             10
	//         );
	//     });

	//     const nextButton = screen.getByRole('button', { name: 'Nästa >' });

	//     userEvent.click(nextButton);

	//     await waitFor(() => {
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
	//         expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
	//             'someSearchTerm',
	//             12,
	//             10
	//         );
	//     });
	// });

	it.todo(
		'if the current page is the last page, the next button should be disabled'
	);

	it.todo('there should be a button to jump to the last page');
	it.todo('there should be a button to jump to the first page');
});
