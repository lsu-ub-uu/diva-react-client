import { render, screen } from '@testing-library/react';
import React from 'react';
import { Outlet } from 'react-router';
import PersonRoot from '../../src/components/PersonRoot';

jest.mock('react-router', () => ({
	Outlet: jest.fn(() => null),
}));

describe('The Person root component', () => {
	it('Should have a heading', () => {
		render(<PersonRoot />);
		const headings = screen.getAllByRole('heading');
		expect(headings).toHaveLength(1);
		expect(headings[0].textContent).toStrictEqual('Personer');
	});
	it('Should include Outlet', () => {
		render(<PersonRoot />);

		expect(Outlet).toBeCalledTimes(1);
	});
});
