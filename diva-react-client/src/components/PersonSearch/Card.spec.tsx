import { render, screen } from '@testing-library/react';
import { Listable, Person } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Card from './Card';
import { renderWithRouter } from '../../../test-utils';
import { createPersonObject } from '../../../testData/personObjectData';
import ListWithLabel from '../PersonPage/ListWithLabel';
import getDomainCollection from '../../divaData/collections';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Link: jest.fn((props: any) => {
		const { to, children } = props;
		return <a href={to}>{children}</a>;
	}),
}));

jest.mock('../PersonPage/ListWithLabel', () => {
	return jest.fn(() => null);
});

jest.mock('../../divaData/collections');
const mockGetDomainCollection = getDomainCollection as jest.MockedFunction<
	typeof getDomainCollection
>;

const someListable: Listable = {
	id: 'someId',
	recordType: 'someRecordType',
};

const somePerson: Person = createPersonObject(
	'someId',
	'someFamilyName',
	'someLastName'
);

beforeAll(() => {
	mockGetDomainCollection.mockReturnValue(new Map());
});

describe('The Card component', () => {
	it('should take a Listable and a listItemNumber as a prop', () => {
		render(
			<MemoryRouter>
				<Card item={someListable} listItemNumber={1} />
			</MemoryRouter>
		);
	});
	it("should render the Listable's id", () => {
		render(
			<MemoryRouter>
				<Card item={someListable} listItemNumber={1} />
			</MemoryRouter>
		);
		expect(screen.getAllByText(/someId/i)).toHaveLength(2);
	});

	describe('presentation', () => {
		describe('if the recordType is unknown', () => {
			it('show $recordType: $recordId', () => {
				render(
					<MemoryRouter>
						<Card item={someListable} listItemNumber={1} />
					</MemoryRouter>
				);
				expect(screen.getByText(/someRecordType: someId/i)).toBeInTheDocument();
			});

			it("should render the Listable's presentation as Link", () => {
				render(
					<MemoryRouter>
						<Card item={someListable} listItemNumber={1} />
					</MemoryRouter>
				);
				const links = screen.getAllByRole('link');
				expect(links).toHaveLength(1);
				expect(links[0].textContent).toStrictEqual('someRecordType: someId');
			});
		});
		describe('if the recordType is "person"', () => {
			it('show familyName, givenName', () => {
				render(
					<MemoryRouter>
						<Card item={somePerson} listItemNumber={1} />
					</MemoryRouter>
				);
				expect(
					screen.getByText(/someFamilyName, someLastName/i)
				).toBeInTheDocument();
			});

			it("should render the Listable's presentation as Link", () => {
				render(
					<MemoryRouter>
						<Card item={somePerson} listItemNumber={1} />
					</MemoryRouter>
				);
				const links = screen.getAllByRole('link');
				expect(links).toHaveLength(1);
				expect(links[0].textContent).toStrictEqual(
					'someFamilyName, someLastName'
				);
			});

			it('if the person does not have an authorised name, display id', () => {
				const somePersonWithoutName: Person = {
					id: 'someId',
					recordType: 'person',
				};
				renderWithRouter(
					<Card item={somePersonWithoutName} listItemNumber={1} />
				);
				expect(
					screen.getByRole('link', { name: 'someId' })
				).toBeInTheDocument();

				const someOtherPersonWithoutName: Person = {
					id: 'someOtherId',
					recordType: 'person',
				};
				renderWithRouter(
					<Card item={someOtherPersonWithoutName} listItemNumber={1} />
				);
				expect(
					screen.getByRole('link', { name: 'someOtherId' })
				).toBeInTheDocument();
			});
		});
	});

	it("should pass the /recordType/id (from the Listable) to the Link's 'to'-attribute", () => {
		render(
			<MemoryRouter>
				<Card item={someListable} listItemNumber={1} />
			</MemoryRouter>
		);

		expect(Link).toHaveBeenCalledTimes(1);
		expect(Link).toHaveBeenLastCalledWith(
			expect.objectContaining({
				to: '/someRecordType/someId',
			}),
			expect.any(Object)
		);
	});

	it('Should display the listItemNumber', () => {
		renderWithRouter(<Card item={someListable} listItemNumber={1} />);

		expect(screen.getByText(/1./));

		renderWithRouter(<Card item={someListable} listItemNumber={432} />);

		expect(screen.getByText(/432./));
	});

	describe('ORCID', () => {
		describe('if the recordType is "person"', () => {
			it('if it has at least one ORCID, should call ListWithLabel with Orcids', () => {
				const person = createPersonObject();
				person.orcids = ['someOrcid'];

				const { rerender } = renderWithRouter(
					<Card item={person} listItemNumber={1} />
				);

				expect(ListWithLabel).toHaveBeenNthCalledWith(
					1,
					expect.objectContaining({
						list: person.orcids,
						label: '',
						omitEmptyStrings: true,
					}),
					expect.any(Object)
				);

				const otherPerson = createPersonObject();
				otherPerson.orcids = ['someOrcid', 'someOtherOrcid'];

				rerender(<Card item={otherPerson} listItemNumber={1} />);

				expect(ListWithLabel).toHaveBeenNthCalledWith(
					2,
					expect.objectContaining({
						list: otherPerson.orcids,
						label: '',
						omitEmptyStrings: true,
					}),
					expect.any(Object)
				);
			});
			it('if orcids are undefined, should not call ListWithLabel', () => {
				const person = createPersonObject();

				renderWithRouter(<Card item={person} listItemNumber={1} />);

				expect(ListWithLabel).not.toHaveBeenCalled();
			});
			it('if orcids are empty, should not call ListWithLabel', () => {
				const person = createPersonObject();
				person.orcids = [];

				renderWithRouter(<Card item={person} listItemNumber={1} />);

				expect(ListWithLabel).not.toHaveBeenCalled();
			});
		});
		describe('if recordType is not "person"', () => {
			it('it should not call ListWithLabel', () => {
				renderWithRouter(<Card item={someListable} listItemNumber={1} />);

				expect(ListWithLabel).not.toHaveBeenCalled();
			});
		});
	});

	describe('Domains', () => {
		describe('if the recordType is "person"', () => {
			it('if it has at least one Domain, should call getDomainCollection', () => {
				const person = createPersonObject();
				person.domains = ['someDomain'];

				renderWithRouter(<Card item={person} listItemNumber={1} />);

				expect(mockGetDomainCollection).toHaveBeenCalledTimes(1);
			});
			it('if domains are undefined, should NOT call getDomainCollection', () => {
				const person = createPersonObject();

				renderWithRouter(<Card item={person} listItemNumber={1} />);

				expect(mockGetDomainCollection).not.toHaveBeenCalled();
			});
			it('if domains are empty, should NOT call getDomainCollection', () => {
				const person = createPersonObject();
				person.domains = [];

				renderWithRouter(<Card item={person} listItemNumber={1} />);

				expect(mockGetDomainCollection).not.toHaveBeenCalled();
			});
			it('if it has at least one domain, should call ListWithLabel with a list of domain names from domainCollection', () => {
				const person = createPersonObject();
				person.domains = ['someDomain', 'someOtherDomain'];

				const domainCollection = new Map();
				domainCollection.set('someDomain', 'someDomainValue');
				domainCollection.set('someOtherDomain', 'someOtherDomainValue');

				mockGetDomainCollection.mockReturnValueOnce(domainCollection);

				const { rerender } = renderWithRouter(
					<Card item={person} listItemNumber={1} />
				);

				expect(ListWithLabel).toHaveBeenCalledTimes(1);
				expect(ListWithLabel).toHaveBeenNthCalledWith(
					1,
					expect.objectContaining({
						label: '',
						omitEmptyStrings: true,
						list: ['someDomainValue', 'someOtherDomainValue'],
					}),
					expect.any(Object)
				);

				const person2 = createPersonObject();
				person2.domains = ['someDomain2', 'someOtherDomain2'];

				const domainCollection2 = new Map();
				domainCollection2.set('someDomain2', 'someDomainValue2');
				domainCollection2.set('someOtherDomain2', 'someOtherDomainValue2');

				mockGetDomainCollection.mockReturnValueOnce(domainCollection2);
				rerender(<Card item={person2} listItemNumber={1} />);

				expect(ListWithLabel).toHaveBeenCalledTimes(2);
				expect(ListWithLabel).toHaveBeenNthCalledWith(
					2,
					expect.objectContaining({
						label: '',
						omitEmptyStrings: true,
						list: ['someDomainValue2', 'someOtherDomainValue2'],
					}),
					expect.any(Object)
				);
			});
			it('if domainCollection does not contain domain key, pass domain key to ListWithLabels', () => {
				const person = createPersonObject();
				person.domains = ['someDomain', 'someOtherDomain'];

				const domainCollection = new Map();
				domainCollection.set('someDomain', 'someDomainValue');

				mockGetDomainCollection.mockReturnValueOnce(domainCollection);

				const { rerender } = renderWithRouter(
					<Card item={person} listItemNumber={1} />
				);

				expect(ListWithLabel).toHaveBeenCalledTimes(1);
				expect(ListWithLabel).toHaveBeenNthCalledWith(
					1,
					expect.objectContaining({
						label: '',
						omitEmptyStrings: true,
						list: ['someDomainValue', 'someOtherDomain'],
					}),
					expect.any(Object)
				);

				const person2 = createPersonObject();
				person2.domains = ['someDomain2', 'someOtherDomain2'];

				const domainCollection2 = new Map();

				mockGetDomainCollection.mockReturnValueOnce(domainCollection2);
				rerender(<Card item={person2} listItemNumber={1} />);

				expect(ListWithLabel).toHaveBeenCalledTimes(2);
				expect(ListWithLabel).toHaveBeenNthCalledWith(
					2,
					expect.objectContaining({
						label: '',
						omitEmptyStrings: true,
						list: ['someDomain2', 'someOtherDomain2'],
					}),
					expect.any(Object)
				);
			});
		});
		describe('if recordType is not "person"', () => {
			it('it should not call ListWithLabel', () => {
				renderWithRouter(<Card item={someListable} listItemNumber={1} />);

				expect(ListWithLabel).not.toHaveBeenCalled();
			});
		});
	});
});
