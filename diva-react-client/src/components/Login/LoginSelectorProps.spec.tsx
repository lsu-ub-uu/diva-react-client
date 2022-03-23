import React from 'react';
import { render } from '@testing-library/react';
import { Select } from 'grommet';
import { LoginType } from 'diva-cora-ts-api-wrapper';
import LoginSelector from './LoginSelector';
import { getSortedLoginUnits } from '../../divaData/resources';

jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	Select: jest.fn((props: any) => {
		const { size } = props;
		return <div>{size}</div>;
	}),
}));

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
	mockGetSortedLoginUnits.mockReturnValue(defaultOptions);
});

describe('LoginSelector', () => {
	describe('Select component', () => {
		it('Calls Grommets select component with', () => {
			render(<LoginSelector />);

			expect(Select).toHaveBeenCalledTimes(1);
			expect(Select).toHaveBeenCalledWith(
				expect.objectContaining({
					options: defaultOptions,
					size: 'medium',
					placeholder: 'Login',
					value: undefined,
					labelKey: 'displayTextSv',
					valueKey: { key: 'displayTextSv' },
					onChange: expect.any(Function),
					onSearch: expect.any(Function),
				}),
				expect.any(Object)
			);
		});
	});
});
