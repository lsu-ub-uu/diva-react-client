import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router';
import App from './App';
import NoMatch from './components/NoMatch';
import PersonPage from './components/PersonPage';
import { renderWithRouter } from '../test-utils';
import PersonRoot from './components/PersonRoot';
import PersonSearch from './components/PersonSearch';
import LoginButton from './components/LoginButton';

jest.mock('../src/components/PersonSearch', () => {
	return jest.fn(() => (
		<div>
			PersonSearch
			<Outlet />
		</div>
	));
});
jest.mock('../src/components/PersonRoot', () => {
	return jest.fn(() => (
		<div>
			PersonRoot
			<Outlet />
		</div>
	));
});
jest.mock('../src/components/PersonPage', () => {
	return jest.fn(() => <div>PersonPage</div>);
});
jest.mock('../src/components/NoMatch', () => {
	return jest.fn(() => null);
});

const mockCounter = jest.fn();
jest.mock('../src/components/ModeSwitcher', () => {
	return function DummyModeSwitcher(props: any) {
		mockCounter(props);
		const { handleClick } = props;
		return (
			<button type="submit" onClick={handleClick}>
				DummyButton
			</button>
		);
	};
});

jest.mock('../src/components/LoginButton', () => {
	return jest.fn(() => null);
});

describe('The App component', () => {
	it('Initially sends darkMode false to ModeSwitcher', () => {
		renderWithRouter(<App />);

		expect(mockCounter).toHaveBeenCalledTimes(1);
		expect(mockCounter).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);
	});

	it('Calls modeSwitcher again with switched theme if callBack is called', () => {
		renderWithRouter(<App />);

		expect(mockCounter).toHaveBeenCalledTimes(1);
		expect(mockCounter).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);

		const button = screen.getByText('DummyButton');

		userEvent.click(button);

		expect(mockCounter).toHaveBeenCalledTimes(2);
		expect(mockCounter).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: true,
			})
		);

		userEvent.click(button);

		expect(mockCounter).toHaveBeenCalledTimes(3);
		expect(mockCounter).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);
	});

	describe('Handles routing', () => {
		it('Renders PersonSearch if route is /', () => {
			render(
				<MemoryRouter initialEntries={['/']}>
					<App />
				</MemoryRouter>
			);

			expect(PersonSearch).toBeCalledTimes(1);
		});

		it('Renders PersonRoot and PersonSearch if route is /person', () => {
			render(
				<MemoryRouter initialEntries={['/person']}>
					<App />
				</MemoryRouter>
			);

			expect(PersonRoot).toBeCalledTimes(1);
			expect(PersonSearch).toBeCalledTimes(1);
		});

		it('Renders PersonPage if route is /person/someId', () => {
			render(
				<MemoryRouter initialEntries={['/person/someId']}>
					<App />
				</MemoryRouter>
			);

			expect(PersonRoot).toBeCalledTimes(1);
			expect(PersonPage).toBeCalledTimes(1);
			expect(PersonSearch).toBeCalledTimes(0);
		});

		it('Renders NoMatch if route is something not matched', () => {
			render(
				<MemoryRouter initialEntries={['/some/unmatched/route']}>
					<App />
				</MemoryRouter>
			);

			expect(NoMatch).toBeCalledTimes(1);
		});
	});

	describe('Login', () => {
		it('renders LoginButton', () => {
			renderWithRouter(<App />);

			expect(LoginButton).toHaveBeenCalledTimes(1);
		});
	});
});
