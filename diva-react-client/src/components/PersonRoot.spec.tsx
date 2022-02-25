import { render } from '@testing-library/react';
import React from 'react';
import { Outlet } from 'react-router';
import PersonRoot from './PersonRoot';

jest.mock('react-router', () => ({
	Outlet: jest.fn(() => null),
}));

describe('The Person root component', () => {
	it('Should include Outlet', () => {
		render(<PersonRoot />);

		expect(Outlet).toBeCalledTimes(1);
	});
});
