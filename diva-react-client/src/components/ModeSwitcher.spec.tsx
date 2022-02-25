import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModeSwitcher from './ModeSwitcher';

const emptyCallBack = function () {};

describe('ModeSwitcher', () => {
	it('Displays a submit button with text containing "dark" (if light mode)', () => {
		render(<ModeSwitcher darkMode={false} handleClick={emptyCallBack} />);

		const buttons = screen.queryAllByRole('button');

		expect(buttons).toHaveLength(1);

		expect(buttons[0]).toHaveAttribute('type', 'submit');
		expect(buttons[0]).toHaveTextContent('dark');
	});

	it('Displays a submit button with text containing "light" (if dark mode)', () => {
		render(<ModeSwitcher darkMode handleClick={emptyCallBack} />);

		const buttons = screen.queryAllByRole('button');

		expect(buttons).toHaveLength(1);

		expect(buttons[0]).toHaveAttribute('type', 'submit');
		expect(buttons[0]).toHaveTextContent('light');
	});

	it('Calls a callback function on button click', () => {
		const handleClick = jest.fn();
		render(<ModeSwitcher darkMode={false} handleClick={handleClick} />);

		const button = screen.getByRole('button');
		userEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
