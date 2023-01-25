import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from 'grommet';
import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import LoginDomainChooser from '..';
import { getSortedLoginUnits } from '../../../../divaData/resources';
import { filterLoginUnits } from '../helpers';
import WebRedirectLogin from '../WebRedirectLogin';
import LDAPLogin from '../LDAPLogin';

jest.mock('../WebRedirectLogin', () => {
	return jest.fn(() => null);
});

jest.mock('../LDAPLogin', () => {
	return jest.fn(() => null);
});

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
					type='button'
					onClick={() => {
						onChange({
							value: loginUnitToReturn,
						});
					}}
				>
					onChange
				</button>
				<button
					type='button'
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

jest.mock('../../../../divaData/resources');
const mockGetSortedLoginUnits = getSortedLoginUnits as jest.MockedFunction<
	typeof getSortedLoginUnits
>;

jest.mock('../helpers');
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
});

describe('LoginDomainChooser', () => {
	describe('Select component', () => {
		it('Calls Grommets select component with props', () => {
			render(<LoginDomainChooser />);

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

		it('calls getSortedLoginUnits', () => {
			render(<LoginDomainChooser />);
			expect(mockGetSortedLoginUnits).toHaveBeenCalled();
		});

		it('onSearch calls filterLoginUnits with options and searchText', () => {
			render(<LoginDomainChooser />);

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
			render(<LoginDomainChooser />);

			userEvent.click(screen.getByRole('button', { name: 'onSearch' }));

			expect(Select).toHaveBeenCalledTimes(2);
		});
	});

	describe('Button area', () => {
		it('Before user has chosen, display WebRedirectLogin with value', () => {
			render(<LoginDomainChooser />);

			expect(WebRedirectLogin).toHaveBeenCalledWith(
				expect.objectContaining({
					value: undefined,
				}),
				expect.any(Object)
			);
		});
		it('If user has chosen WebRedirectLogin, display WebRedirectLogin, NOT LDAPLogin', () => {
			render(<LoginDomainChooser />);

			simulateUserChoosingOption();

			expect(WebRedirectLogin).toHaveBeenCalledWith(
				expect.objectContaining({
					value: loginUnitToReturn,
				}),
				expect.any(Object)
			);

			expect(LDAPLogin).not.toHaveBeenCalled();
		});
		it('If user has chosen LDAP login, display LDAPLogin, NOT WebRedirectLogin', () => {
			render(<LoginDomainChooser />);
			expect(WebRedirectLogin).toHaveBeenCalledTimes(1);

			loginUnitToReturn = {
				displayTextEn: 'displayTextEn',
				displayTextSv: 'displayTextSv',
				type: LoginType.LoginLDAP,
				url: 'url',
			};

			simulateUserChoosingOption();

			expect(LDAPLogin).toHaveBeenCalledTimes(1);
			expect(WebRedirectLogin).toHaveBeenCalledTimes(1);
		});
	});
});

const simulateUserChoosingOption = () => {
	userEvent.click(screen.getByRole('button', { name: 'onChange' }));
};
