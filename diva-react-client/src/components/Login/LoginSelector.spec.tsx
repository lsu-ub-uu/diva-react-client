import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from 'grommet';
import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import LoginSelector from './LoginSelector';
import { getSortedLoginUnits } from '../../divaData/resources';
import useWebRedirectLogin from './useWebRedirectLogin';
import { filterLoginUnits } from './helpers';

jest.mock('./useWebRedirectLogin');
const mockUseWebRedirectLogin = useWebRedirectLogin as jest.MockedFunction<
	typeof useWebRedirectLogin
>;
const mockStartLoginProcess = jest.fn();

let searchTerm = 'someText';
let loginUnitToReturn: LoginUnitObject = {
	displayTextEn: 'displayTextEn',
	displayTextSv: 'displayTextSv',
	type: LoginType.LoginWebRedirect,
	url: 'url',
};
jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	Select: jest.fn((props: any) => {
		const { onChange, onSearch } = props;
		return (
			<>
				<button
					type="button"
					onClick={() => {
						onChange({
							value: loginUnitToReturn,
						});
					}}
				>
					onChange
				</button>
				<button
					type="button"
					onClick={() => {
						onSearch(searchTerm);
					}}
				>
					onSearch
				</button>
			</>
		);
	}),
}));

jest.mock('../../divaData/resources');
const mockGetSortedLoginUnits = getSortedLoginUnits as jest.MockedFunction<
	typeof getSortedLoginUnits
>;

jest.mock('./helpers');
const mockFilterLoginUnits = filterLoginUnits as jest.MockedFunction<
	typeof filterLoginUnits
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
	mockGetSortedLoginUnits.mockReturnValue(defaultOptions);

	mockUseWebRedirectLogin.mockReturnValue({
		startLoginProcess: mockStartLoginProcess,
	});
});

describe('LoginSelector', () => {
	describe('Select component', () => {
		it('Calls Grommets select component with props', () => {
			render(<LoginSelector />);

			expect(Select).toHaveBeenCalledTimes(1);
			expect(Select).toHaveBeenCalledWith(
				expect.objectContaining({
					options: defaultOptions,
					size: 'medium',
					placeholder: 'Välj organisation',
					value: undefined,
					labelKey: 'displayTextSv',
					valueKey: { key: 'displayTextSv' },
					onChange: expect.any(Function),
					onSearch: expect.any(Function),
				}),
				expect.any(Object)
			);
		});

		it('calls useWebRedirectLogin', () => {
			render(<LoginSelector />);
			expect(mockUseWebRedirectLogin).toHaveBeenCalled();
		});

		it('calls getSortedLoginUnits', () => {
			render(<LoginSelector />);
			expect(mockGetSortedLoginUnits).toHaveBeenCalled();
		});

		it('onSearch calls filterLoginUnits with options and searchText', () => {
			render(<LoginSelector />);

			userEvent.click(screen.getByRole('button', { name: 'onSearch' }));

			expect(mockFilterLoginUnits).toHaveBeenCalledWith(
				defaultOptions,
				'someText'
			);

			searchTerm = 'someOtherText';
			userEvent.click(screen.getByRole('button', { name: 'onSearch' }));

			expect(mockFilterLoginUnits).toHaveBeenCalledWith(
				defaultOptions,
				'someOtherText'
			);
		});

		it('onSearch calls setOptions and in such a way rerenders Select', () => {
			render(<LoginSelector />);

			userEvent.click(screen.getByRole('button', { name: 'onSearch' }));

			expect(Select).toHaveBeenCalledTimes(2);
		});
	});

	describe('Button component', () => {
		it('renders a disabled button', () => {
			render(<LoginSelector />);

			const loginButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});

			expect(loginButton).toBeInTheDocument();

			expect(loginButton).toBeDisabled();
		});

		it('if user has selected an option, button should not be disabled', () => {
			render(<LoginSelector />);
			simulateUserChoosingOption();

			const loginButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});
			expect(loginButton).not.toBeDisabled();
		});

		it("if login button is clicked, call startLoginProcess with value's url", () => {
			render(<LoginSelector />);

			simulateUserChoosingOption();

			userEvent.click(
				screen.getByRole('button', {
					name: 'Logga in på organisation',
				})
			);

			expect(mockStartLoginProcess).toHaveBeenCalledWith('url');

			loginUnitToReturn = {
				displayTextEn: 'displayTextEn',
				displayTextSv: 'displayTextSv',
				type: LoginType.LoginWebRedirect,
				url: 'some other Url',
			};
			simulateUserChoosingOption();

			userEvent.click(
				screen.getByRole('button', {
					name: 'Logga in på organisation',
				})
			);

			expect(mockStartLoginProcess).toHaveBeenCalledWith('some other Url');
		});
	});
});

const simulateUserChoosingOption = () => {
	userEvent.click(screen.getByRole('button', { name: 'onChange' }));
};