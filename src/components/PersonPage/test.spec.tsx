// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import PersonPage from '.';
import PersonView from './PersonView';
import useGetPersonById from '../../hooks/useGetPersonById';
import { personWithDomain } from '../../../testData/personData';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

jest.mock('../../hooks/useGetPersonById');

const mockUseGetPersonById = useGetPersonById as jest.MockedFunction<
	typeof useGetPersonById
>;

jest.mock('./PersonView', () => {
	return jest.fn(() => {
		return <div />;
	});
});

beforeAll(() => {
	mockUseGetPersonById.mockReturnValue({
		person: personWithDomain,
		isLoading: false,
		error: undefined,
	});
});

describe('The Person component', () => {
	it('should call hook with personId', () => {
		render(<PersonPage />);
		expect(mockUseGetPersonById).toHaveBeenCalledTimes(1);
		expect(mockUseGetPersonById).toHaveBeenCalledWith('someId');
	});

	it('should show loading if hook is loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: true,
		});
		render(<PersonPage />);
		expect(screen.getByText(/Hämtar persondata.../i)).toBeInTheDocument();
	});

	it('should not show loading if hook is loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
		});
		render(<PersonPage />);
		expect(screen.queryAllByText(/Hämtar persondata.../i)).toHaveLength(0);
	});

	it('should show error message if hook returns error', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
			error: new Error('Some Error from hook'),
		});
		render(<PersonPage />);
		expect(
			screen.getByText(/Någonting gick fel: Some Error from hook/i)
		).toBeInTheDocument();
	});

	it('should not show error message if hook does not return error', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
		});
		render(<PersonPage />);
		expect(
			screen.queryAllByText(/Någonting gick fel: Some Error from hook/i)
		).toHaveLength(0);
	});

	it('should not call PersonView if no person returned', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: true,
			person: undefined,
		});

		render(<PersonPage />);

		expect(PersonView).not.toHaveBeenCalled();
	});

	it('should call PersonView if hook returns person and hook not loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
			person: personWithDomain,
		});

		render(<PersonPage />);

		expect(PersonView).toHaveBeenCalledTimes(1);
		expect(PersonView).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});
});
