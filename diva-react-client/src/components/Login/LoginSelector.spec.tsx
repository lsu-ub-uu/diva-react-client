import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginType } from 'diva-cora-ts-api-wrapper';
import LoginSelector from './LoginSelector';
import useWebRedirectLogin from './useWebRedirectLogin';
import { getSortedLoginUnits } from '../../divaData/resources';

jest.mock('./useWebRedirectLogin');
const mockUseWebRedirectLogin = useWebRedirectLogin as jest.MockedFunction<
	typeof useWebRedirectLogin
>;

const mockStartLoginProcess = jest.fn();

jest.mock('../../divaData/resources');

const mockGetSortedLoginUnits = getSortedLoginUnits as jest.MockedFunction<
	typeof getSortedLoginUnits
>;

const defaultOptions = [
	{
		url: 'someUrl1',
		displayTextEn: 'displayTextEn',
		displayTextSv: 'displayTextSv',
		type: LoginType.LoginWebRedirect,
	},
	{
		url: 'someUrl2',
		displayTextEn: 'displayTextEn2',
		displayTextSv: 'displayTextSv2',
		type: LoginType.LoginWebRedirect,
	},
	{
		url: 'someUrl3',
		displayTextEn: 'displayTextEn3',
		displayTextSv: 'displayTextSv3',
		type: LoginType.LoginWebRedirect,
	},
];
beforeAll(() => {
	mockUseWebRedirectLogin.mockReturnValue({
		startLoginProcess: mockStartLoginProcess,
	});

	mockGetSortedLoginUnits.mockReturnValue(defaultOptions);
});

describe('LoginSelector', () => {
	it('calls useWebRedirectLogin', () => {
		render(<LoginSelector />);
		expect(mockUseWebRedirectLogin).toHaveBeenCalled();
	});

	it('calls getSortedLoginUnits', () => {
		render(<LoginSelector />);
		expect(mockGetSortedLoginUnits).toHaveBeenCalled();
	});

	it.skip('if one option is selected, startLoginProcess is called', () => {
		render(<LoginSelector />);

		userEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(screen.getByRole('heading'));
	});
});
