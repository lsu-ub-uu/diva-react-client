import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import WebRedirectLogin from './WebRedirectLogin';
import useWebRedirectLogin from './useWebRedirectLogin';

jest.mock('./useWebRedirectLogin');
const mockUseWebRedirectLogin = useWebRedirectLogin as jest.MockedFunction<
	typeof useWebRedirectLogin
>;
const mockStartLoginProcess = jest.fn();

const loginUnit: LoginUnitObject = {
	displayTextEn: 'displayTextEn',
	displayTextSv: 'displayTextSv',
	type: LoginType.LoginWebRedirect,
	url: 'url',
};

beforeAll(() => {
	mockUseWebRedirectLogin.mockReturnValue({
		startLoginProcess: mockStartLoginProcess,
	});
});

describe('WebRedirectLogin', () => {
	describe('Button component', () => {
		it('calls useWebRedirectLogin', () => {
			render(<WebRedirectLogin value={undefined} />);

			expect(mockUseWebRedirectLogin).toHaveBeenCalledTimes(1);
		});

		it('renders a disabled button if called with undefined', () => {
			render(<WebRedirectLogin value={undefined} />);

			const loginButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});

			expect(loginButton).toBeInTheDocument();

			expect(loginButton).toBeDisabled();
		});

		it('Button should not be disabled if value not undefined', () => {
			render(<WebRedirectLogin value={loginUnit} />);

			const loginButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});
			expect(loginButton).not.toBeDisabled();
		});

		it("if login button is clicked, call startLoginProcess with value's url", () => {
			const { rerender } = render(<WebRedirectLogin value={loginUnit} />);

			userEvent.click(
				screen.getByRole('button', {
					name: 'Logga in på organisation',
				})
			);

			expect(mockStartLoginProcess).toHaveBeenCalledWith('url');

			const otherLoginUnit = {
				displayTextEn: 'displayTextEn',
				displayTextSv: 'displayTextSv',
				type: LoginType.LoginWebRedirect,
				url: 'some other Url',
			};

			rerender(<WebRedirectLogin value={otherLoginUnit} />);

			userEvent.click(
				screen.getByRole('button', {
					name: 'Logga in på organisation',
				})
			);

			expect(mockStartLoginProcess).toHaveBeenCalledWith('some other Url');
		});
	});
});
