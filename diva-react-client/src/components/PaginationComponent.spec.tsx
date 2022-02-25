import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PaginationComponent from './PaginationComponent';
import usePagination from '../hooks/usePagination';

const onPaginationUpdate = jest.fn();

jest.mock('../../src/hooks/usePagination');
const mockUsePagination = usePagination as jest.MockedFunction<
	typeof usePagination
>;

const mockGoToFirstPage = jest.fn();
const mockGoToPreviousPage = jest.fn();
const mockGoToNextPage = jest.fn();
const mockGoToLastPage = jest.fn();

const returnFromUsePagination = {
	goToFirstPage: mockGoToFirstPage,
	goToPreviousPage: mockGoToPreviousPage,
	goToNextPage: mockGoToNextPage,
	goToLastPage: mockGoToLastPage,
	isFirstPage: true,
	isLastPage: true,
};

beforeEach(() => {
	mockUsePagination.mockReturnValue(returnFromUsePagination);
});

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

	describe('the next-button...', () => {
		it('should exist: display a button with text ">"', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const nextButton = screen.getByRole('button', { name: '>' });
			expect(nextButton).toBeInTheDocument();
		});

		it("if the next-button is clicked, usePagination's goToNextPage should be called", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isLastPage: false,
			});
			render(
				<PaginationComponent
					start={2}
					rows={5}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const nextButton = screen.getByRole('button', { name: '>' });

			userEvent.click(nextButton);

			expect(mockGoToNextPage).toHaveBeenCalledTimes(1);
		});

		it("should be disabled if usePagination says we're on the last page", () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			const nextButton = screen.getByRole('button', { name: '>' });
			expect(nextButton).toBeDisabled();
		});

		it("should NOT be disabled if usePagination says we're NOT on the last page", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isLastPage: false,
			});
			render(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={0}
					totalNumber={200}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);

			const nextButton = screen.getByRole('button', { name: '>' });
			expect(nextButton).not.toBeDisabled();
		});
	});

	describe('the last-button...', () => {
		it('should exist: display a button with text ">|"', () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: '>|' });
			expect(lastButton).toBeInTheDocument();
		});

		it("should be disabled if usePagination says we're on the last page", () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={100}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: '>|' });
			expect(lastButton).toBeDisabled();
		});

		it("should NOT be disabled if usePagination says we're NOT on the last page", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isLastPage: false,
			});
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={100}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: '>|' });
			expect(lastButton).not.toBeDisabled();
		});

		it("if the last-button is clicked, usePagination's goToLastPage should be called", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isLastPage: false,
			});
			render(
				<PaginationComponent
					start={1}
					rows={5}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: '>|' });
			userEvent.click(lastButton);

			expect(mockGoToLastPage).toHaveBeenCalledTimes(1);
		});
	});

	describe('the previous-button...', () => {
		it('should exist: display a button with text "<"', () => {
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
				name: '<',
			});
			expect(previousButton).toBeInTheDocument();
		});
		it("should be disabled if usePagination says we're on the first page", () => {
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
				name: '<',
			});
			expect(previousButton).toBeDisabled();
		});

		it("should be disabled if usePagination says we're not on the first page", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isFirstPage: false,
			});
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
				name: '<',
			});
			expect(previousButton).not.toBeDisabled();
		});

		it("if the previous-button is clicked, usePagination's goToPreviousPage should be called", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isFirstPage: false,
			});
			render(
				<PaginationComponent
					start={1}
					rows={5}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: '<' });
			userEvent.click(lastButton);

			expect(mockGoToPreviousPage).toHaveBeenCalledTimes(1);
		});
	});

	describe('the first-button...', () => {
		it('should exist: display a button with text "|<"', () => {
			render(
				<PaginationComponent
					start={101}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|<' });
			expect(firstButton).toBeInTheDocument();
		});

		it("should be disabled if usePagination says we're on the first page", () => {
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|<' });
			expect(firstButton).toBeDisabled();
		});

		it("should NOT be disabled if usePagination says we're NOT on the first page", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isFirstPage: false,
			});
			render(
				<PaginationComponent
					start={1}
					rows={100}
					toNumber={0}
					totalNumber={400}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const firstButton = screen.getByRole('button', { name: '|<' });
			expect(firstButton).not.toBeDisabled();
		});

		it("if the first-button is clicked, usePagination's goToFirstPage should be called", () => {
			mockUsePagination.mockReturnValue({
				...returnFromUsePagination,
				isFirstPage: false,
			});
			render(
				<PaginationComponent
					start={1}
					rows={5}
					toNumber={0}
					totalNumber={23}
					onPaginationUpdate={onPaginationUpdate}
				/>
			);
			const lastButton = screen.getByRole('button', { name: '|<' });
			userEvent.click(lastButton);

			expect(mockGoToFirstPage).toHaveBeenCalledTimes(1);
		});
	});
});
