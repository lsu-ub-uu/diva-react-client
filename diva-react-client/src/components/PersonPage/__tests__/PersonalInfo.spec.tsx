import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	createCompleteFormPerson,
	createMinimumFormPersonWithIdAndName,
} from '../../../../testData/personObjectData';
import PersonalInfo from '../PersonalInfo';
import ExternalLink from '../../ExternalLink';

const ComponentToTest = PersonalInfo;

jest.mock('../ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../../ExternalLink', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	NameValueList: jest.fn((props: any) => {
		const { children } = props;
		return <div>{children}</div>;
	}),
	NameValuePair: jest.fn((props: any) => {
		const { children, name } = props;
		return (
			<div>
				<p>{name}</p>
				{children}
			</div>
		);
	}),
	Text: jest.fn((props: any) => {
		const { children } = props;
		return <p>{children}</p>;
	}),
}));

describe('PersonalInfo', () => {
	it('should take a person', () => {
		render(
			<ComponentToTest person={createMinimumFormPersonWithIdAndName()} />
		);
	});

	describe('alternative names', () => {
		it('should NOT display a list if no field with repeatable is given', () => {
			const person = createMinimumFormPersonWithIdAndName();
			render(<ComponentToTest person={person} />);

			expect(screen.queryByRole('list')).not.toBeInTheDocument();
		});

		it('should display list with names if alternativeNames exist', () => {
			const person = createMinimumFormPersonWithIdAndName();
			person.alternativeNames = [
				{
					repeatId: 0,
					content: {
						givenName: 'Kalle',
						familyName: 'Anka',
					},
				},
			];
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.getByRole('list')).toBeInTheDocument();
			expect(screen.getByRole('listitem')).toHaveTextContent(
				'Anka, Kalle'
			);

			person.alternativeNames.push({
				repeatId: 1,
				content: {
					givenName: 'Mickey',
					familyName: 'Mouse',
				},
			});
			person.alternativeNames.push({
				repeatId: 2,
				content: {
					givenName: '',
					familyName: 'Maus',
				},
			});
			person.alternativeNames.push({
				repeatId: 3,
				content: {
					givenName: 'Micky',
					familyName: '',
				},
			});
			rerender(<ComponentToTest person={person} />);

			const listItems = screen.getAllByRole('listitem');

			expect(listItems[0]).toHaveTextContent('Anka, Kalle');
			expect(listItems[1]).toHaveTextContent('Mouse, Mickey');
			expect(listItems[2]).toHaveTextContent('Maus,');
			expect(listItems[3]).toHaveTextContent(', Micky');
		});
	});
	describe('External URLs ', () => {
		it('should call ExternalLinks for one external URL', () => {
			const person = createMinimumFormPersonWithIdAndName();

			person.externalURLs = [
				{
					content: { URL: 'someUrl', linkTitle: 'someText' },
					repeatId: 0,
				},
			];

			render(<ComponentToTest person={person} />);

			expect(ExternalLink).toHaveBeenCalledTimes(1);
			expect(screen.getByRole('list')).toBeInTheDocument();
			expect(screen.getAllByRole('listitem')).toHaveLength(1);
		});

		it('should call ExternalLinks for each external URL', () => {
			const person = createCompleteFormPerson();

			person.alternativeNames = [];

			render(<ComponentToTest person={person} />);

			expect(ExternalLink).toHaveBeenCalledTimes(2);

			expect(ExternalLink).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					URL: 'http://du.se',
					text: 'DU',
				}),
				expect.any(Object)
			);

			expect(ExternalLink).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					URL: 'http://uu.se',
					text: 'Uppsala Universitet',
				}),
				expect.any(Object)
			);
			expect(screen.getAllByRole('listitem')).toHaveLength(2);
		});

		it('should display yearOfBirth, yearOfDeath and emailAddress if present', () => {
			const person = createCompleteFormPerson();

			render(<ComponentToTest person={person} />);

			expect(screen.getByText('Födelseår')).toBeInTheDocument();
			expect(screen.getByText('1900')).toBeInTheDocument();
			expect(screen.getByText('Dödsår')).toBeInTheDocument();
			expect(screen.getByText('2000')).toBeInTheDocument();
			expect(screen.getByText('E-Post')).toBeInTheDocument();
			expect(screen.getByText('foo@bar.com')).toBeInTheDocument();
		});

		it('should not display yearOfBirth, yearOfDeath and emailAddress not if present', () => {
			const person = createMinimumFormPersonWithIdAndName();

			render(<ComponentToTest person={person} />);

			expect(screen.queryByText('Födelseår')).not.toBeInTheDocument();
			expect(screen.queryByText('1900')).not.toBeInTheDocument();
			expect(screen.queryByText('Dödsår')).not.toBeInTheDocument();
			expect(screen.queryByText('2000')).not.toBeInTheDocument();
			expect(screen.queryByText('E-Post')).not.toBeInTheDocument();
			expect(screen.queryByText('foo@bar.com')).not.toBeInTheDocument();
		});
	});
});
