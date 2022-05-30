import { render, screen } from '@testing-library/react';
import {
	ExtendedPersonReturnType,
	getPersonById,
} from 'diva-cora-ts-api-wrapper';
import React from 'react';
import {
	createCompletePerson,
	personWithDomain,
} from '../../../testData/personObjectData';
import useApi from '../../hooks/useApi';
import PersonFetcher from './PersonFetcher';

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

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

const simpleData: ExtendedPersonReturnType = {
	person: personWithDomain,
	personDomainParts: [],
	organisations: [],
};

const mockChild = jest.fn();

const renderDefaultPersonFetcher = () => {
	render(
		<PersonFetcher id="someId">
			{
				(injectedProps) => mockChild(injectedProps)
				// return <p data-testid="injectedChild">{injectedProps.record.id}</p>
			}
		</PersonFetcher>
	);
};

beforeAll(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: simpleData },
		isLoading: false,
		setApiParams: jest.fn(),
	});
});

describe('PersonFetcher', () => {
	it('should call hook with getPersonById', () => {
		renderDefaultPersonFetcher();
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenCalledWith(getPersonById, expect.any(Object));
	});
	it('should call hook with id', () => {
		renderDefaultPersonFetcher();
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				id: 'someId',
			})
		);

		render(
			<PersonFetcher id="someOtherId">
				{(injectedProps) => <div>{injectedProps.record.person.id}</div>}
			</PersonFetcher>
		);
		expect(mockUseApi).toHaveBeenCalledTimes(2);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				id: 'someOtherId',
			})
		);

		render(
			<PersonFetcher id="">
				{(injectedProps) => <div>{injectedProps.record.person.id}</div>}
			</PersonFetcher>
		);
		expect(mockUseApi).toHaveBeenCalledTimes(3);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				id: '',
			})
		);
	});

	it('should show loading if hook is loading', () => {
		const toReturn = createMinimalResult();
		toReturn.isLoading = true;
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultPersonFetcher();
		expect(screen.getByText(/Hämtar data.../i)).toBeInTheDocument();
	});
	it('should not show loading if hook is not loading', () => {
		const toReturn = createMinimalResult();
		toReturn.isLoading = false;
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultPersonFetcher();
		expect(screen.queryByText(/Hämtar data.../i)).not.toBeInTheDocument();
	});
	it('should show error message if hook returns error', () => {
		const toReturn = createMinimalResult();
		toReturn.result.error = new Error('Some Error from hook');
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultPersonFetcher();
		expect(
			screen.getByText(/Någonting gick fel: Some Error from hook/i)
		).toBeInTheDocument();

		const toReturn2 = createMinimalResult();
		toReturn2.result.error = new Error('Some other Error from hook');
		mockUseApi.mockReturnValue(toReturn2);
		renderDefaultPersonFetcher();
		expect(
			screen.getByText(/Någonting gick fel: Some other Error from hook/i)
		).toBeInTheDocument();
	});
	it('should not show error message if hook does not return error', () => {
		const toReturn = createMinimalResult();
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultPersonFetcher();
		expect(screen.queryByTestId('errorMessage')).not.toBeInTheDocument();
	});
	it('should not call children if no data returned', () => {
		const toReturn = createMinimalResult();
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultPersonFetcher();
		expect(mockChild).not.toHaveBeenCalled();
	});
	it('should call children if hook returns data and hook not loading', () => {
		const toReturn = createMinimalResult();
		toReturn.result.data = personWithDomain;
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultPersonFetcher();
		expect(mockChild).toHaveBeenCalledTimes(1);
		expect(mockChild).toHaveBeenLastCalledWith(
			expect.objectContaining({
				record: personWithDomain,
			})
		);

		const toReturn2 = createMinimalResult();
		toReturn2.result.data = createCompletePerson();
		mockUseApi.mockReturnValue(toReturn2);
		renderDefaultPersonFetcher();
		expect(mockChild).toHaveBeenCalledTimes(2);
		expect(mockChild).toHaveBeenLastCalledWith(
			expect.objectContaining({
				record: toReturn2.result.data,
			})
		);
	});
});
