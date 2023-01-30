import React from 'react';
import { screen } from '@testing-library/react';
import EditButton from '../EditButton';
import { LOGIN_STATUS } from '../../../context/AuthContext';
import { renderWithRouter } from '../../../../test-utils';

const mockAuth = jest.fn();
jest.mock('../../../context/AuthContext', () => ({
	...jest.requireActual('../../../context/AuthContext'),
	useAuth: () => {
		return mockAuth();
	},
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Link: jest.fn((props: any) => {
		const { to, children } = props;
		return <a href={to}>{children}</a>;
	}),
}));

jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	Button: jest.fn((props: any) => {
		const { icon, a11yTitle } = props;
		return (
			<>
				{icon}
				<div data-testid='a11yTitle'>{a11yTitle}</div>
			</>
		);
	}),
}));

jest.mock('grommet-icons', () => ({
	...jest.requireActual('grommet-icons'),
	Edit: jest.fn(() => {
		return <div data-testid='icon'>Edit</div>;
	}),
}));

beforeAll(() => {
	mockAuth.mockReturnValue({
		auth: {
			deleteUrl: '',
			idFromLogin: '',
			status: LOGIN_STATUS.LOGGED_IN,
			token: '',
			domain: 'uu',
		},
	});
});

describe('EditButton', () => {
	it('Should take recordType and ID', () => {
		renderWithRouter(
			<EditButton
				recordType='person'
				id='someId'
			/>
		);
	});

	it('Should not return link if user not logged in', () => {
		mockAuth.mockReturnValueOnce({
			auth: {
				deleteUrl: '',
				idFromLogin: '',
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
				domain: '',
			},
		});

		renderWithRouter(
			<EditButton
				recordType='person'
				id='someId'
			/>
		);

		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('Should return a link if user is logged in', () => {
		renderWithRouter(
			<EditButton
				recordType='person'
				id='someId'
			/>
		);

		expect(screen.getByRole('link')).toBeInTheDocument();
	});

	it('Should return link with "to" = "/$recordType/edit/$id"', () => {
		const { rerender } = renderWithRouter(
			<EditButton
				recordType='person'
				id='someId'
			/>
		);

		expect(screen.getByRole('link')).toHaveAttribute(
			'href',
			'/person/edit/someId'
		);

		rerender(
			<EditButton
				recordType='recordType'
				id='someOtherId'
			/>
		);
		expect(screen.getByRole('link')).toHaveAttribute(
			'href',
			'/recordType/edit/someOtherId'
		);
	});

	it('Should render button containing Edit and a11yTitle "Editera"', () => {
		renderWithRouter(
			<EditButton
				recordType='person'
				id='someId'
			/>
		);
		expect(screen.getByTestId('icon')).toHaveTextContent('Edit');
		expect(screen.getByTestId('a11yTitle')).toHaveTextContent('Editera');
	});

	it('Should render button containing Edit', () => {
		renderWithRouter(
			<EditButton
				recordType='person'
				id='someId'
			/>
		);
		expect(screen.getByTestId('icon')).toHaveTextContent('Edit');
	});
});
