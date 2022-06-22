import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import { Organisation, PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import PersonPage from '.';
import {
	createCompleteFormPerson,
	createCompletePerson,
	personWithDomain,
} from '../../../testData/personObjectData';
import useApi from '../../hooks/useApi';
import PersonEdit from './PersonEdit/PersonEdit';
import FormPersonView from './FormPersonView';
import { convertToFormPerson } from '../../types/FormPerson';
import { convertToFormPersonDomainPart } from '../../types/FormPersonDomainPart';
import { minimalFormPersonDomainPart } from '../../../testData/personDomainPartObjectData';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

jest.mock('./FormPersonView', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('./PersonEdit/PersonEdit', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../../types/FormPerson');
const mockConvertToFormPerson = convertToFormPerson as jest.MockedFunction<
	typeof convertToFormPerson
>;

jest.mock('../../types/FormPersonDomainPart');
const mockConvertToFormPersonDomainPart =
	convertToFormPersonDomainPart as jest.MockedFunction<
		typeof convertToFormPersonDomainPart
	>;

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

beforeEach(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: personWithDomain },
		isLoading: false,
		setApiParams: jest.fn(),
	});

	mockConvertToFormPerson.mockReturnValue(createCompleteFormPerson());
	mockConvertToFormPersonDomainPart.mockReturnValue(
		minimalFormPersonDomainPart
	);
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

	describe('if edit is not set', () => {
		it('Should not call PersonEdit', () => {
			const person = createCompletePerson();

			render(<PersonPage />);

			render(
				<Child record={{ person, organisations: [], personDomainParts: [] }} />
			);

			expect(PersonEdit).not.toHaveBeenCalled();
		});

		it('Should render FormPersonView with formPerson returned from convertToFormPerson', () => {
			render(<PersonPage />);

			render(
				<Child
					record={{
						person: personWithDomain,
						organisations: [],
						personDomainParts: [],
					}}
				/>
			);

			expect(convertToFormPerson).toHaveBeenCalledTimes(1);
			expect(convertToFormPerson).toHaveBeenLastCalledWith(personWithDomain);

			expect(FormPersonView).toHaveBeenCalledWith(
				expect.objectContaining({
					person: createCompleteFormPerson(),
					organisations: expect.any(Map),
					personDomainParts: expect.any(Array),
				}),
				expect.any(Object)
			);
		});

		it('Should render FormPersonView with an organisationMap containing id => name based on organisations returned from PersonFetcher', () => {
			const person = createCompletePerson();

			const organisationArray: Organisation[] = [
				{
					id: 'someId',
					alternativeName: '',
					name: 'someName',
					organisationType: 'subOrganisation',
					recordType: 'organisation',
				},
			];

			render(<PersonPage />);

			render(
				<Child
					record={{
						person,
						organisations: organisationArray,
						personDomainParts: [],
					}}
				/>
			);

			const organisations = new Map<string, string>();

			organisations.set('someId', 'someName');

			expect(FormPersonView).toHaveBeenLastCalledWith(
				expect.objectContaining({
					person: expect.any(Object),
					organisations,
					personDomainParts: expect.any(Array),
				}),
				expect.any(Object)
			);
		});
		it('Should render FormPersonView with formPersonDomainParts from convertToFormPersonDomainPart', () => {
			const personDomainPart = {
				id: 'someId',
				affiliations: [],
				domain: 'uu',
				recordType: 'personDomainPart',
				identifiers: [],
			};
			const personDomainParts: PersonDomainPart[] = [personDomainPart];

			render(<PersonPage />);

			render(
				<Child
					record={{
						person: personWithDomain,
						organisations: [],
						personDomainParts,
					}}
				/>
			);

			expect(convertToFormPersonDomainPart).toHaveBeenCalledTimes(1);
			expect(convertToFormPersonDomainPart).toHaveBeenLastCalledWith(
				personDomainPart
			);

			expect(FormPersonView).toHaveBeenCalledWith(
				expect.objectContaining({
					person: expect.any(Object),
					organisations: expect.any(Map),
					personDomainParts: [minimalFormPersonDomainPart],
				}),
				expect.any(Object)
			);
		});

		it.skip('should render FormPersonView with person from PersonFetcher', () => {
			// TODO remove
			render(<PersonPage />);

			render(<Child record={{ person: personWithDomain }} />);

			expect(FormPersonView).toHaveBeenCalledTimes(1);
			expect(FormPersonView).toHaveBeenCalledWith(
				expect.objectContaining({
					person: personWithDomain,
				}),
				expect.any(Object)
			);
		});

		it.skip('should render FormPersonView with person from PersonFetcher 2', () => {
			// TODO remove
			const person = createCompletePerson();
			render(<PersonPage />);

			render(<Child record={{ person }} />);

			expect(FormPersonView).toHaveBeenCalledTimes(1);
			expect(FormPersonView).toHaveBeenCalledWith(
				expect.objectContaining({
					person,
				}),
				expect.any(Object)
			);
		});
	});

	describe('if edit is set', () => {
		it('should not render FormPersonView', () => {
			const person = createCompletePerson();

			render(<PersonPage edit />);

			render(<Child record={{ person }} />);

			expect(FormPersonView).not.toHaveBeenCalled();
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
