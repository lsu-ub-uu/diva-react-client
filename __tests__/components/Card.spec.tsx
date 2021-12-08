import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Card from '../../src/components/Card';
import { personWithDomain } from '../../testData/personData';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Link: jest.fn((props: any) => {
		const { to, children } = props;
		return <a href={to}>{children}</a>;
	}),
}));

describe('The Card component', () => {
	it('should take a Listable as a prop', () => {
		render(
			<MemoryRouter>
				<Card item={personWithDomain} />
			</MemoryRouter>
		);
	});
	it("should render the Listable's id and presentation()", () => {
		render(
			<MemoryRouter>
				<Card item={personWithDomain} />
			</MemoryRouter>
		);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();
		expect(screen.getByText(/2/i)).toBeInTheDocument();
	});
	it("should render the Listable's presentation() as Link", () => {
		render(
			<MemoryRouter>
				<Card item={personWithDomain} />
			</MemoryRouter>
		);
		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(1);
		expect(links[0].textContent).toStrictEqual('Enequist, Gerd');
	});
	it("should pass the Listable's getLink() to the Link's 'to'", () => {
		render(
			<MemoryRouter>
				<Card item={personWithDomain} />
			</MemoryRouter>
		);

		expect(Link).toHaveBeenCalledTimes(1);
		expect(Link).toHaveBeenLastCalledWith(
			expect.objectContaining({
				to: personWithDomain.getLink(),
			}),
			expect.any(Object)
		);
	});
});
