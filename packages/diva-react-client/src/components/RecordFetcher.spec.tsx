import { render, screen } from '@testing-library/react';
import { getRecordById, Person, RecordType } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import {
	createCompletePerson,
	personWithDomain,
} from '../../testData/personObjectData';
import useApi from '../hooks/useApi';
import RecordFetcher from './RecordFetcher';

jest.mock('../hooks/useApi');
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

const mockChild = jest.fn();

const renderDefaultRecordFetcher = () => {
	render(
		<RecordFetcher<Person> recordType={RecordType.Person} id="someId">
			{
				(injectedProps) => mockChild(injectedProps)
				// return <p data-testid="injectedChild">{injectedProps.record.id}</p>
			}
		</RecordFetcher>
	);
};

beforeAll(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: personWithDomain },
		isLoading: false,
		setApiParams: jest.fn(),
	});
});

describe('RecordFetcher', () => {
	it('should take recordType, id, <T> and children', () => {
		renderDefaultRecordFetcher();
	});
	it('should call hook with getRecordById', () => {
		renderDefaultRecordFetcher();
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenCalledWith(getRecordById, expect.any(Object));
	});
	it('should call hook with recordType that was passed', () => {
		renderDefaultRecordFetcher();
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: RecordType.Person,
				id: expect.any(String),
			})
		);

		render(
			<RecordFetcher<Person>
				recordType={RecordType.PersonDomainPart}
				id="someId"
			>
				{(injectedProps) => <div>{injectedProps.record.id}</div>}
			</RecordFetcher>
		);
		expect(mockUseApi).toHaveBeenCalledTimes(2);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: RecordType.PersonDomainPart,
				id: expect.any(String),
			})
		);
	});
	it('should call hook with id', () => {
		renderDefaultRecordFetcher();
		expect(mockUseApi).toHaveBeenCalledTimes(1);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someId',
			})
		);

		render(
			<RecordFetcher<Person> recordType={RecordType.Person} id="someOtherId">
				{(injectedProps) => <div>{injectedProps.record.id}</div>}
			</RecordFetcher>
		);
		expect(mockUseApi).toHaveBeenCalledTimes(2);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someOtherId',
			})
		);

		render(
			<RecordFetcher<Person> recordType={RecordType.Person} id="">
				{(injectedProps) => <div>{injectedProps.record.id}</div>}
			</RecordFetcher>
		);
		expect(mockUseApi).toHaveBeenCalledTimes(3);
		expect(mockUseApi).toHaveBeenLastCalledWith(
			expect.any(Function),
			expect.objectContaining({
				recordType: expect.any(String),
				id: '',
			})
		);
	});

	it('should show loading if hook is loading', () => {
		const toReturn = createMinimalResult();
		toReturn.isLoading = true;
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultRecordFetcher();
		expect(screen.getByText(/Hämtar data.../i)).toBeInTheDocument();
	});
	it('should not show loading if hook is not loading', () => {
		const toReturn = createMinimalResult();
		toReturn.isLoading = false;
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultRecordFetcher();
		expect(screen.queryByText(/Hämtar data.../i)).not.toBeInTheDocument();
	});
	it('should show error message if hook returns error', () => {
		const toReturn = createMinimalResult();
		toReturn.result.error = new Error('Some Error from hook');
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultRecordFetcher();
		expect(
			screen.getByText(/Någonting gick fel: Some Error from hook/i)
		).toBeInTheDocument();

		const toReturn2 = createMinimalResult();
		toReturn2.result.error = new Error('Some other Error from hook');
		mockUseApi.mockReturnValue(toReturn2);
		renderDefaultRecordFetcher();
		expect(
			screen.getByText(/Någonting gick fel: Some other Error from hook/i)
		).toBeInTheDocument();
	});
	it('should not show error message if hook does not return error', () => {
		const toReturn = createMinimalResult();
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultRecordFetcher();
		expect(screen.queryByTestId('errorMessage')).not.toBeInTheDocument();
	});
	it('should not call children if no data returned', () => {
		const toReturn = createMinimalResult();
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultRecordFetcher();
		expect(mockChild).not.toHaveBeenCalled();
	});
	it('should call children if hook returns data and hook not loading', () => {
		const toReturn = createMinimalResult();
		toReturn.result.data = personWithDomain;
		mockUseApi.mockReturnValue(toReturn);
		renderDefaultRecordFetcher();
		expect(mockChild).toHaveBeenCalledTimes(1);
		expect(mockChild).toHaveBeenLastCalledWith(
			expect.objectContaining({
				record: personWithDomain,
			})
		);

		const toReturn2 = createMinimalResult();
		toReturn2.result.data = createCompletePerson();
		mockUseApi.mockReturnValue(toReturn2);
		renderDefaultRecordFetcher();
		expect(mockChild).toHaveBeenCalledTimes(2);
		expect(mockChild).toHaveBeenLastCalledWith(
			expect.objectContaining({
				record: toReturn2.result.data,
			})
		);
	});
});
