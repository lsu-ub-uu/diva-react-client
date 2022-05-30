import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import { Organisation, PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import PersonPage from '.';
import PersonView from './PersonView';
import {
	createCompletePerson,
	personWithDomain,
} from '../../../testData/personObjectData';
import useApi from '../../hooks/useApi';
import PersonEdit from './PersonEdit/PersonEdit';

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

jest.mock('./PersonEdit/PersonEdit', () => {
	return jest.fn(() => {
		return <div />;
	});
});

let Child: (props: any) => JSX.Element;

const mockedPersonFetcher = jest.fn();
jest.mock('./PersonFetcher', () => {
	return function RFetcher(props: any) {
		mockedPersonFetcher(props);
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
	it('should render PersonFetcher with id from useParams', () => {
		useParams.mockReturnValueOnce({ personId: 'someNiceId' });
		render(<PersonPage />);

		expect(mockedPersonFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				id: 'someNiceId',
			})
		);

		useParams.mockReturnValueOnce({ personId: 'someOtherId' });
		render(<PersonPage />);

		expect(mockedPersonFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				id: 'someOtherId',
			})
		);
	});

	it('should not render PersonFetcher if id from useParams is empty string or undefined', () => {
		useParams.mockReturnValueOnce({ personId: '' });
		render(<PersonPage />);

		expect(mockedPersonFetcher).not.toHaveBeenCalled();

		useParams.mockReturnValueOnce({});
		render(<PersonPage />);

		expect(mockedPersonFetcher).not.toHaveBeenCalled();
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

	it('should render PersonView with person from PersonFetcher', () => {
		render(<PersonPage />);

		render(<Child record={{ person: personWithDomain }} />);

		expect(PersonView).toHaveBeenCalledTimes(1);
		expect(PersonView).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});

	it('should render PersonView with person from PersonFetcher 2', () => {
		const person = createCompletePerson();
		render(<PersonPage />);

		render(<Child record={{ person }} />);

		expect(PersonView).toHaveBeenCalledTimes(1);
		expect(PersonView).toHaveBeenCalledWith(
			expect.objectContaining({
				person,
			}),
			expect.any(Object)
		);
	});

	describe('if edit is set', () => {
		it('should not render PersonView', () => {
			const person = createCompletePerson();

			render(<PersonPage edit />);

			render(<Child record={{ person }} />);

			expect(PersonView).not.toHaveBeenCalled();
		});

		it('should render PersonEdit', () => {
			const person = createCompletePerson();

			render(<PersonPage edit />);

			render(
				<Child record={{ person, organisations: [], personDomainParts: [] }} />
			);

			expect(PersonEdit).toHaveBeenCalledTimes(1);
			expect(PersonEdit).toHaveBeenLastCalledWith(
				expect.objectContaining({
					originalPerson: person,
					originalOrganisations: [],
					originalPersonDomainParts: [],
				}),
				expect.any(Object)
			);

			const organisations: Organisation[] = [
				{
					id: 'someId',
					alternativeName: '',
					name: 'someName',
					organisationType: 'subOrganisation',
					recordType: 'organisation',
				},
			];

			const personDomainParts: PersonDomainPart[] = [
				{
					id: 'someId',
					affiliations: [],
					domain: 'uu',
					recordType: 'personDomainPart',
					identifiers: [],
				},
			];

			render(<Child record={{ person, organisations, personDomainParts }} />);

			expect(PersonEdit).toHaveBeenCalledTimes(2);
			expect(PersonEdit).toHaveBeenLastCalledWith(
				expect.objectContaining({
					originalPerson: person,
					originalOrganisations: organisations,
					originalPersonDomainParts: personDomainParts,
				}),
				expect.any(Object)
			);
		});
	});
});
