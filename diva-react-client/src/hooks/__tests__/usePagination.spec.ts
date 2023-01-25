import { renderHook } from '@testing-library/react-hooks/dom';
import usePagination from '../usePagination';

const defaultOnPaginationUpdate = jest.fn();

describe('the usePagination hook', () => {
	it('should take "start", "rows", "totalNumber" and "onPaginationUpdate"', () => {
		renderHook(() => usePagination(1, 100, 300, defaultOnPaginationUpdate));
	});
	it('should return goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage, isFirstPage, isLastPage', () => {
		const { result } = renderHook(() =>
			usePagination(1, 100, 300, defaultOnPaginationUpdate)
		);

		expect(result.current.goToFirstPage).toBeDefined();
		expect(result.current.goToPreviousPage).toBeDefined();
		expect(result.current.goToNextPage).toBeDefined();
		expect(result.current.goToLastPage).toBeDefined();
		expect(result.current.isFirstPage).toBeDefined();
		expect(result.current.isLastPage).toBeDefined();
	});

	it('calling goToFirstPage should call onPaginationUpdate with start=1', () => {
		const expectedRows = 100;
		const { result, rerender } = renderHook(
			({ start, rows }) =>
				usePagination(start, rows, 300, defaultOnPaginationUpdate),
			{ initialProps: { start: 50, rows: expectedRows } }
		);

		result.current.goToFirstPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(1);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(1);

		rerender({ start: 200, rows: expectedRows });

		result.current.goToFirstPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(2);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(1);
	});

	it('calling goToPreviousPage should call onPaginationUpdate with new start=start-rows', () => {
		let expectedRows = 100;
		const { result, rerender } = renderHook(
			({ start, rows }) =>
				usePagination(start, rows, 300, defaultOnPaginationUpdate),
			{ initialProps: { start: 301, rows: expectedRows } }
		);

		result.current.goToPreviousPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(1);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(201);

		expectedRows = 75;
		rerender({ start: 200, rows: expectedRows });

		result.current.goToPreviousPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(2);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(125);
	});

	it('calling goToPreviousPage should never call onPaginationUpdate < 1', () => {
		let expectedRows = 100;
		const { result, rerender } = renderHook(
			({ start, rows }) =>
				usePagination(start, rows, 300, defaultOnPaginationUpdate),
			{ initialProps: { start: 50, rows: expectedRows } }
		);

		result.current.goToPreviousPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(1);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(1);

		expectedRows = 200;
		rerender({ start: 200, rows: expectedRows });

		result.current.goToPreviousPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(2);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(1);
	});

	it('calling goToNextPage should call onPaginationUpdate with new start=start+rows', () => {
		let expectedRows = 100;
		const { result, rerender } = renderHook(
			({ start, rows }) =>
				usePagination(start, rows, 500, defaultOnPaginationUpdate),
			{ initialProps: { start: 301, rows: expectedRows } }
		);

		result.current.goToNextPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(1);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(401);

		expectedRows = 75;
		rerender({ start: 200, rows: expectedRows });

		result.current.goToNextPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(2);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(275);
	});

	it('calling goToNextPage should never call onPaginationUpdate with new start>totalNumber ', () => {
		let expectedRows = 100;
		const { result, rerender } = renderHook(
			({ start, rows, totalNumber }) =>
				usePagination(
					start,
					rows,
					totalNumber,
					defaultOnPaginationUpdate
				),
			{
				initialProps: {
					start: 201,
					rows: expectedRows,
					totalNumber: 300,
				},
			}
		);

		result.current.goToNextPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(1);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(300);

		expectedRows = 75;
		rerender({ start: 200, rows: expectedRows, totalNumber: 250 });

		result.current.goToNextPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(2);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(250);
	});

	it('calling goToLastPage should call onPaginationUpdate with a start value leading to the last page given the current row value', () => {
		let expectedRows = 100;
		const { result, rerender } = renderHook(
			({ start, rows, totalNumber }) =>
				usePagination(
					start,
					rows,
					totalNumber,
					defaultOnPaginationUpdate
				),
			{
				initialProps: {
					start: 201,
					rows: expectedRows,
					totalNumber: 600,
				},
			}
		);

		result.current.goToLastPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(1);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(501);

		expectedRows = 75;
		rerender({ start: 33, rows: expectedRows, totalNumber: 450 });

		result.current.goToLastPage();

		expect(defaultOnPaginationUpdate).toHaveBeenCalledTimes(2);
		expect(defaultOnPaginationUpdate).toHaveBeenLastCalledWith(408);
	});

	it('on the first page of a result set, isFirstPage should be true', () => {
		const { result, rerender } = renderHook(
			({ start, rows, totalNumber }) =>
				usePagination(
					start,
					rows,
					totalNumber,
					defaultOnPaginationUpdate
				),
			{ initialProps: { start: 1, rows: 100, totalNumber: 600 } }
		);

		expect(result.current.isFirstPage).toBe(true);

		rerender({ start: 1, rows: 5, totalNumber: 10 });

		expect(result.current.isFirstPage).toBe(true);

		rerender({ start: 2, rows: 20, totalNumber: 300 });

		expect(result.current.isFirstPage).toBe(false);
	});

	it('on the last page of a result set (if totalNumber - start <= rows), isLastPage should be true', () => {
		const { result, rerender } = renderHook(
			({ start, rows, totalNumber }) =>
				usePagination(
					start,
					rows,
					totalNumber,
					defaultOnPaginationUpdate
				),
			{ initialProps: { start: 550, rows: 100, totalNumber: 600 } }
		);

		expect(result.current.isLastPage).toBe(true);

		rerender({ start: 501, rows: 100, totalNumber: 600 });
		expect(result.current.isLastPage).toBe(true);

		rerender({ start: 2, rows: 100, totalNumber: 100 });
		expect(result.current.isLastPage).toBe(true);

		rerender({ start: 1, rows: 100, totalNumber: 100 });
		expect(result.current.isLastPage).toBe(true);
		expect(result.current.isFirstPage).toBe(true);

		rerender({ start: 20, rows: 100, totalNumber: 400 });
		expect(result.current.isLastPage).toBe(false);
	});
});
