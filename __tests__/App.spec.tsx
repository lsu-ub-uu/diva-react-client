import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

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

describe('The App component', () => {
	it('Initially sends darkMode false to ModeSwitcher', () => {
		render(<App />);

		expect(mockCounter).toHaveBeenCalledTimes(1);
		expect(mockCounter).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);
	});

	it('Calls modeSwitcher again with switched theme if callBack is called', () => {
		render(<App />);

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
});
