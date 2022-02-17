import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import PersonPage from '.';
import PersonView from './PersonView';
import { personWithDomain } from '../../../testData/personObjectData';
import useApi from '../../hooks/useApi';
import { getRecordById } from '../../cora/api/api';
import { RecordType } from '../../cora/types/Record';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

jest.mock('./PersonView', () => {
	return jest.fn(() => {
		return <div />;
	});
});

const createMinimalResult = (): {
	result: {
		hasData: boolean;
		isError: boolean;
		data?: any;
		error?: Error;
	};
	isLoading: boolean;
	setApiParams: any;
} => {
	return {
		result: {
			hasData: false,
			isError: false,
			data: undefined,
			error: undefined,
		},
		isLoading: true,
		setApiParams: jest.fn(),
	};
};

beforeAll(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: personWithDomain },
		isLoading: false,
		setApiParams: jest.fn(),
	});
});

describe('The Person component', () => {
	it('should call hook with getRecordById', () => {
		render(<PersonPage />);
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenCalledWith(getRecordById, expect.any(Object));
	});
	it('should call hook with personId if personId exists', () => {
		render(<PersonPage />);
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someId',
			})
		);

		useParams.mockReturnValueOnce({ personId: 'someOtherId' });
		render(<PersonPage />);
		expect(mockUseApi).toHaveBeenCalledTimes(2);
		expect(mockUseApi).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someOtherId',
			})
		);
	});

	it('should call hook with empty string if personId does not exist', () => {
		useParams.mockReturnValueOnce({});

		render(<PersonPage />);
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: expect.any(String),
				id: '',
			})
		);
	});

	it('should call hook with RecordType.person ', () => {
		useParams.mockReturnValueOnce({});

		render(<PersonPage />);
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: RecordType.Person,
				id: expect.any(String),
			})
		);
	});

	it('should show loading if hook is loading', () => {
		const toReturn = createMinimalResult();
		toReturn.isLoading = true;
		mockUseApi.mockReturnValue(toReturn);
		render(<PersonPage />);
		expect(screen.getByText(/Hämtar persondata.../i)).toBeInTheDocument();
	});

	it('should not show loading if hook is not loading', () => {
		const toReturn = createMinimalResult();
		toReturn.isLoading = false;
		mockUseApi.mockReturnValue(toReturn);
		render(<PersonPage />);
		expect(screen.queryByText(/Hämtar persondata.../i)).not.toBeInTheDocument();
	});

	it('should show error message if hook returns error', () => {
		const toReturn = createMinimalResult();
		toReturn.result.error = new Error('Some Error from hook');
		mockUseApi.mockReturnValue(toReturn);
		render(<PersonPage />);
		expect(
			screen.getByText(/Någonting gick fel: Some Error from hook/i)
		).toBeInTheDocument();
	});

	it('should not show error message if hook does not return error', () => {
		const toReturn = createMinimalResult();
		mockUseApi.mockReturnValue(toReturn);
		render(<PersonPage />);
		expect(
			screen.queryByText(/Någonting gick fel: Some Error from hook/i)
		).not.toBeInTheDocument();
	});

	it('should not call PersonView if no person returned', () => {
		const toReturn = createMinimalResult();
		mockUseApi.mockReturnValue(toReturn);

		render(<PersonPage />);

		expect(PersonView).not.toHaveBeenCalled();
	});

	it('should call PersonView if hook returns person and hook not loading', () => {
		const toReturn = createMinimalResult();
		toReturn.result.data = personWithDomain;
		mockUseApi.mockReturnValue(toReturn);

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
