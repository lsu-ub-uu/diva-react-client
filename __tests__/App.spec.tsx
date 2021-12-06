import React from 'react';
import { render } from '@testing-library/react';
import ModeSwitcher from '../src/components/ModeSwitcher';
import App from '../src/App';
import { act } from 'react-dom/test-utils';

jest.mock('../src/components/ModeSwitcher');

type Props = {
	darkMode: boolean;
	handleClick: () => void;
};

let props: Props;

const mockModeSwitcher = jest.fn();
const modeSwitcher = ModeSwitcher as jest.MockedFunction<typeof ModeSwitcher>;

beforeEach(() => {
	jest.clearAllMocks();
	modeSwitcher.mockImplementation((propsIn: Props) => {
		mockModeSwitcher(propsIn);
		return <div />;
	});
});

describe('The App component', () => {
	it('Initially sends darkMode false to ModeSwitcher', () => {
		render(<App />);

		expect(mockModeSwitcher).toHaveBeenCalledTimes(1);
		expect(mockModeSwitcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);
	});

	it('Calls modeSwitcher again with switched theme if callBack is called', () => {
		mockModeSwitcher.mockImplementation((propsIn: any) => {
			props = propsIn;
		});
		render(<App />);

		expect(mockModeSwitcher).toHaveBeenCalledTimes(1);
		expect(mockModeSwitcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);

		act(() => {
			props.handleClick();
		});

		expect(mockModeSwitcher).toHaveBeenCalledTimes(2);
		expect(mockModeSwitcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: true,
			})
		);

		props.handleClick();

		expect(mockModeSwitcher).toHaveBeenCalledTimes(5);
		expect(mockModeSwitcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				darkMode: false,
			})
		);
	});
});
