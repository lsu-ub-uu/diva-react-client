import { render, screen } from '@testing-library/react';
import { Listable, Person } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Card from './Card';
import { renderWithRouter } from '../../test-utils';
import { createPersonObject } from '../../testData/personObjectData';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Link: jest.fn((props: any) => {
		const { to, children } = props;
		return <a href={to}>{children}</a>;
	}),
}));

const someListable: Listable = {
	id: 'someId',
	recordType: 'someRecordType',
};

const somePerson: Person = createPersonObject(
	'someId',
	'someFamilyName',
	'someLastName'
);

describe('The Card component', () => {
	it('should take a Listable as a prop', () => {
		render(
			<MemoryRouter>
				<Card item={someListable} />
			</MemoryRouter>
		);
	});
	it("should render the Listable's id", () => {
		render(
			<MemoryRouter>
				<Card item={someListable} />
			</MemoryRouter>
		);
		expect(screen.getAllByText(/someId/i)).toHaveLength(2);
	});

	describe('presentation', () => {
		describe('if the recordType is unknown', () => {
			it('show $recordType: $recordId', () => {
				render(
					<MemoryRouter>
						<Card item={someListable} />
					</MemoryRouter>
				);
				expect(screen.getByText(/someRecordType: someId/i)).toBeInTheDocument();
			});

			it("should render the Listable's presentation as Link", () => {
				render(
					<MemoryRouter>
						<Card item={someListable} />
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
						<Card item={somePerson} />
					</MemoryRouter>
				);
				expect(
					screen.getByText(/someFamilyName, someLastName/i)
				).toBeInTheDocument();
			});

			it("should render the Listable's presentation as Link", () => {
				render(
					<MemoryRouter>
						<Card item={somePerson} />
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
				renderWithRouter(<Card item={somePersonWithoutName} />);
				expect(
					screen.getByRole('link', { name: 'someId' })
				).toBeInTheDocument();

				const someOtherPersonWithoutName: Person = {
					id: 'someOtherId',
					recordType: 'person',
				};
				renderWithRouter(<Card item={someOtherPersonWithoutName} />);
				expect(
					screen.getByRole('link', { name: 'someOtherId' })
				).toBeInTheDocument();
			});
		});
	});

	it("should pass the /recordType/id (from the Listable) to the Link's 'to'", () => {
		render(
			<MemoryRouter>
				<Card item={someListable} />
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
});
