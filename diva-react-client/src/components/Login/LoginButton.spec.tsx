import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropButton } from 'grommet';
import LoginButton from './LoginButton';

jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	DropButton: jest.fn((props: any) => {
		const { onOpen, onClose } = props;
		return (
			<>
				<button
					type='button'
					onClick={() => {
						onOpen();
					}}
				>
					onOpen
				</button>
				<button
					type='button'
					onClick={() => {
						onClose();
					}}
				>
					onClose
				</button>
			</>
		);
	}),
}));

const basicParameters = {
	icon: expect.any(Object),
	reverse: true,
	label: 'Logga in',
	open: false,
	onOpen: expect.any(Function),
	onClose: expect.any(Function),
	dropContent: expect.any(Object),
	dropProps: { align: { top: 'bottom' } },
};

describe('LoginButton.spec', () => {
	it('renders DropButton with parameters', () => {
		render(<LoginButton />);
		expect(DropButton).toHaveBeenCalledWith(
			expect.objectContaining(basicParameters),
			expect.any(Object)
		);
	});

	it('if onOpen is called, rerender DropButton with open=true', () => {
		render(<LoginButton />);

		userEvent.click(screen.getByRole('button', { name: 'onOpen' }));

		expect(DropButton).toHaveBeenLastCalledWith(
			expect.objectContaining({
				...basicParameters,
				open: true,
			}),
			expect.any(Object)
		);
	});
	it('if onClose is called, rerender DropButton with open=false', () => {
		render(<LoginButton />);

		userEvent.click(screen.getByRole('button', { name: 'onOpen' }));
		userEvent.click(screen.getByRole('button', { name: 'onClose' }));

		expect(DropButton).toHaveBeenCalledTimes(3);
		expect(DropButton).toHaveBeenLastCalledWith(
			expect.objectContaining({
				...basicParameters,
				open: false,
			}),
			expect.any(Object)
		);
	});
});
