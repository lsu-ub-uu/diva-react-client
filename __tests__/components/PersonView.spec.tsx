import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import PersonView from '../../src/components/PersonView';
import useGetPersonById from '../../src/hooks/useGetPersonById';
import { personWithDomain } from '../../testData/personData';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

jest.mock('../../src/hooks/useGetPersonById');

const mockUseGetPersonById = useGetPersonById as jest.MockedFunction<
	typeof useGetPersonById
>;

beforeAll(() => {
	mockUseGetPersonById.mockReturnValue({
		person: personWithDomain,
		isLoading: false,
		error: undefined,
	});
});

describe('The Person component', () => {
	it('Should take the personId from useParams and render it 1', () => {
		render(<PersonView />);
		expect(useParams).toBeCalledTimes(1);
		expect(screen.getByText(/Person ID: someId/i)).toBeInTheDocument();
	});

	it('Should take the personId from useParams and render it 2', () => {
		useParams.mockReturnValueOnce({ personId: 'someOtherId' });
		render(<PersonView />);
		expect(useParams).toBeCalledTimes(1);
		expect(screen.getByText(/Person ID: someOtherId/i)).toBeInTheDocument();
	});

	it('should call hook with personId', () => {
		render(<PersonView />);
		expect(mockUseGetPersonById).toHaveBeenCalledTimes(1);
		expect(mockUseGetPersonById).toHaveBeenCalledWith('someId');
	});

	it('should show loading if hook is loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: true,
		});
		render(<PersonView />);
		expect(screen.getByText(/Hämtar persondata.../i)).toBeInTheDocument();
	});

	it('should not show loading if hook is loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
		});
		render(<PersonView />);
		expect(screen.queryAllByText(/Hämtar persondata.../i)).toHaveLength(0);
	});

	it('should show error message if hook returns error', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
			error: new Error('Some Error from hook'),
		});
		render(<PersonView />);
		expect(
			screen.getByText(/Någonting gick fel: Some Error from hook/i)
		).toBeInTheDocument();
	});

	it('should not show error message if hook does not return error', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
		});
		render(<PersonView />);
		expect(
			screen.queryAllByText(/Någonting gick fel: Some Error from hook/i)
		).toHaveLength(0);
	});

	it('should not show person if hook returns person but hook still loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: true,
			person: personWithDomain,
		});

		render(<PersonView />);
		expect(screen.getByText(/Hämtar persondata.../i)).toBeInTheDocument();
		expect(screen.queryAllByAltText(/Enequist, Gerd/i)).toHaveLength(0);
	});

	it('should show person if hook returns person and hook not loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
			person: personWithDomain,
		});

		render(<PersonView />);
		expect(screen.queryAllByAltText(/Hämtar persondata.../i)).toHaveLength(0);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();
	});
});
