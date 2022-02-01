// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import PersonView from '.';
import useGetPersonById from '../../hooks/useGetPersonById';
import { completePerson, personWithDomain } from '../../../testData/personData';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

jest.mock('../../hooks/useGetPersonById');

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

	it('should not show person no person returned', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: true,
			person: undefined,
		});

		render(<PersonView />);
		expect(screen.getByText(/Hämtar persondata.../i)).toBeInTheDocument();
		expect(screen.queryAllByText(/Enequist, Gerd/i)).toHaveLength(0);
	});

	it('should show person if hook returns person and hook not loading', () => {
		mockUseGetPersonById.mockReturnValue({
			isLoading: false,
			person: personWithDomain,
		});

		render(<PersonView />);
		expect(screen.queryAllByText(/Hämtar persondata.../i)).toHaveLength(0);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();
	});

	it('should display ORCID label and ORCIDs if they exist on person', () => {
		mockUseGetPersonById.mockReturnValueOnce({
			isLoading: false,
			person: completePerson,
		});

		render(<PersonView />);
		expect(screen.getByText(/ORCID:/i)).toBeInTheDocument();
		expect(screen.getByText(/someOrcid/i)).toBeInTheDocument();
		// expect(screen.getByText(/someOrcid/i)).toBeInTheDocument();
	});
	it('should display VIAF label and VIAF ids if they exist on person', () => {});
	it('should display Libris label and Libris ids if they exist on person', () => {});

	it('should not display ORCID label if person has no ORCIDs', () => {
		mockUseGetPersonById.mockReturnValueOnce({
			isLoading: false,
			person: personWithDomain,
		});

		render(<PersonView />);
		expect(screen.queryByText(/ORCID:/i)).not.toBeInTheDocument();
	});
	it.todo('should not display VIAF label if person has no ORCIDs');
	it.todo('should not display Libris label if person has no ORCIDs');
});
