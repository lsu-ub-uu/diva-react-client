import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginType } from 'diva-cora-ts-api-wrapper';
import LoginUnitList from './LoginUnitList';
import { getLoginUnits } from '../../divaData/resources';

jest.mock('../../divaData/resources');

const mockGetLoginUnits = getLoginUnits as jest.MockedFunction<
	typeof getLoginUnits
>;

beforeAll(() => {
	mockGetLoginUnits.mockReturnValue([
		{
			url: 'someUrl',
			displayTextEn: 'someDisplayTextEn',
			displayTextSv: 'someDisplayTextSv',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl2',
			displayTextEn: 'someDisplayTextEn2',
			displayTextSv: 'someDisplayTextSv2',
			type: LoginType.LoginWebRedirect,
		},
	]);
});

describe('LoginUnitList', () => {
	describe('LoginUnits', () => {
		it('if loginUnits is empty, renders info', () => {
			mockGetLoginUnits.mockReturnValueOnce([]);

			render(<LoginUnitList />);

			expect(screen.queryByRole('list')).not.toBeInTheDocument();
		});
	});
});
