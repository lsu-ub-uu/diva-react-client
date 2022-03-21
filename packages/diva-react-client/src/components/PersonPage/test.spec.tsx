import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import { RecordType } from 'diva-cora-ts-api-wrapper';
import PersonPage from '.';
import PersonView from './PersonView';
import {
	createCompletePerson,
	personWithDomain,
} from '../../../testData/personObjectData';
import useApi from '../../hooks/useApi';

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

let Child: (props: any) => JSX.Element;

const mockedRecordFetcher = jest.fn();
jest.mock('../RecordFetcher', () => {
	return function RFetcher(props: any) {
		mockedRecordFetcher(props);
		const { children } = props;
		Child = children;
		return null;
	};
});

beforeAll(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: personWithDomain },
		isLoading: false,
		setApiParams: jest.fn(),
	});
});

describe('The Person component', () => {
	it('should render RecordFetcher with recordType RecordType.Person', () => {
		render(<PersonPage />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: RecordType.Person,
				id: expect.any(String),
			})
		);
	});

	it('should render RecordFetcher id from useParams', () => {
		useParams.mockReturnValueOnce({ personId: 'someNiceId' });
		render(<PersonPage />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someNiceId',
			})
		);

		useParams.mockReturnValueOnce({ personId: 'someOtherId' });
		render(<PersonPage />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someOtherId',
			})
		);
	});

	it('should not render RecordFetcher if id from useParams is empty string or undefined', () => {
		useParams.mockReturnValueOnce({ personId: '' });
		render(<PersonPage />);

		expect(mockedRecordFetcher).not.toHaveBeenCalled();

		useParams.mockReturnValueOnce({});
		render(<PersonPage />);

		expect(mockedRecordFetcher).not.toHaveBeenCalled();
	});

	it('should render "Ange ID för att hämta person." if id from useParams is empty string or undefined', () => {
		useParams.mockReturnValueOnce({ personId: '' });
		const { rerender } = render(<PersonPage />);

		expect(
			screen.getByText(/Ange ID för att hämta person./)
		).toBeInTheDocument();

		useParams.mockReturnValueOnce({});
		rerender(<PersonPage />);

		expect(
			screen.getByText(/Ange ID för att hämta person./)
		).toBeInTheDocument();
	});

	it('should not render "Ange ID för att hämta person." if id from useParams is NOT empty string or undefined', () => {
		useParams.mockReturnValueOnce({ personId: 'some' });
		render(<PersonPage />);

		expect(
			screen.queryByText(/Ange ID för att hämta person./)
		).not.toBeInTheDocument();
	});

	it('should render PersonView with person from RecordFetcher', () => {
		render(<PersonPage />);

		render(<Child record={personWithDomain} />);

		expect(PersonView).toHaveBeenCalledTimes(1);
		expect(PersonView).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});

	it('should render PersonView with person from RecordFetcher 2', () => {
		const person = createCompletePerson();
		render(<PersonPage />);

		render(<Child record={person} />);

		expect(PersonView).toHaveBeenCalledTimes(1);
		expect(PersonView).toHaveBeenCalledWith(
			expect.objectContaining({
				person,
			}),
			expect.any(Object)
		);
	});
});
