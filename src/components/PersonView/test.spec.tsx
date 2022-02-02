// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import PersonView from '.';
import useGetPersonById from '../../hooks/useGetPersonById';
import { personWithDomain } from '../../../testData/personData';
import Identifiers from './Identifiers';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

jest.mock('../../hooks/useGetPersonById');

const mockUseGetPersonById = useGetPersonById as jest.MockedFunction<
	typeof useGetPersonById
>;

jest.mock('./Identifiers', () => {
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

	describe('Identifiers...', () => {
		it('should not call Identifiers if no person', () => {
			mockUseGetPersonById.mockReturnValue({
				isLoading: true,
				person: undefined,
			});

			render(<PersonView />);

			expect(Identifiers).not.toHaveBeenCalled();
		});

		it('should call Identifiers with person if person', () => {
			mockUseGetPersonById.mockReturnValue({
				isLoading: false,
				person: personWithDomain,
			});

			render(<PersonView />);

			expect(Identifiers).toHaveBeenCalledTimes(1);
			expect(Identifiers).toHaveBeenCalledWith(
				expect.objectContaining({
					person: personWithDomain,
				}),
				expect.any(Object)
			);
		});
	});

	// describe('identifiers', () => {
	// 	it('should call ListWithLabel with id', () => {
	// 		mockUseGetPersonById.mockReturnValueOnce({
	// 			isLoading: false,
	// 			person: personWithDomain,
	// 		});

	// 		const { rerender } = render(<PersonView />);

	// 		expect(ListWithLabel).toHaveBeenCalledTimes(1);
	// 		expect(ListWithLabel).toHaveBeenCalledWith(
	// 			expect.objectContaining({
	// 				label: 'pID',
	// 				list: [personWithDomain.id],
	// 			}),
	// 			expect.any(Object)
	// 		);

	// 		const otherPerson = createMinimumPersonWithIdAndName('someId');
	// 		mockUseGetPersonById.mockReturnValueOnce({
	// 			isLoading: false,
	// 			person: otherPerson,
	// 		});

	// 		rerender(<PersonView />);

	// 		expect(ListWithLabel).toHaveBeenCalledTimes(2);
	// 		expect(ListWithLabel).toHaveBeenCalledWith(
	// 			expect.objectContaining({
	// 				label: 'pID',
	// 				list: [otherPerson.id],
	// 			}),
	// 			expect.any(Object)
	// 		);
	// 	});

	// 	it('should call ListWithLabel with ORCID and orcidIds if they exist on person', () => {
	// 		const person = createCompletePerson();
	// 		person.viafIDs = [];
	// 		person.librisIDs = [];
	// 		mockUseGetPersonById.mockReturnValueOnce({
	// 			isLoading: false,
	// 			person,
	// 		});

	// 		render(<PersonView />);

	// 		expect(ListWithLabel).toHaveBeenCalledTimes(2);
	// 		expect(ListWithLabel).toHaveBeenNthCalledWith(
	// 			2,
	// 			expect.objectContaining({
	// 				label: 'ORCID',
	// 				list: completePerson.orcidIDs,
	// 			}),
	// 			expect.any(Object)
	// 		);
	// 	});

	// 	it('should call ListWithLabel with VIAF and viafIds if they exist on person', () => {
	// 		const person = createCompletePerson();
	// 		person.orcidIDs = [];
	// 		person.librisIDs = [];
	// 		mockUseGetPersonById.mockReturnValueOnce({
	// 			isLoading: false,
	// 			person,
	// 		});

	// 		render(<PersonView />);

	// 		expect(ListWithLabel).toHaveBeenCalledTimes(2);
	// 		expect(ListWithLabel).toHaveBeenNthCalledWith(
	// 			2,
	// 			expect.objectContaining({
	// 				label: 'VIAF',
	// 				list: completePerson.viafIDs,
	// 			}),
	// 			expect.any(Object)
	// 		);
	// 	});

	// 	it('should call ListWithLabel with Libris-id and librisIDs if they exist on person', () => {
	// 		const person = createCompletePerson();
	// 		person.orcidIDs = [];
	// 		person.viafIDs = [];
	// 		mockUseGetPersonById.mockReturnValueOnce({
	// 			isLoading: false,
	// 			person,
	// 		});

	// 		render(<PersonView />);

	// 		expect(ListWithLabel).toHaveBeenCalledTimes(2);
	// 		expect(ListWithLabel).toHaveBeenNthCalledWith(
	// 			2,
	// 			expect.objectContaining({
	// 				label: 'Libris-id',
	// 				list: completePerson.librisIDs,
	// 			}),
	// 			expect.any(Object)
	// 		);
	// 	});

	// 	it('should not call ListWithLabel for ORCID if person has no ORCIDs, VIAFs or Libris ids', () => {
	// 		mockUseGetPersonById.mockReturnValueOnce({
	// 			isLoading: false,
	// 			person: personWithDomain,
	// 		});
	// 		render(<PersonView />);

	// 		expect(ListWithLabel).toHaveBeenCalledTimes(1);
	// 	});
	// });
});
