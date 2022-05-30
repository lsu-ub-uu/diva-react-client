import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
} from '../../../testData/personObjectData';
import PersonalInfo from './PersonalInfo';
import ExternalLink from '../ExternalLink';
import ListWithLabel from './ListWithLabel';

const ComponentToTest = PersonalInfo;

jest.mock('./ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../ExternalLink', () => {
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
		render(<ComponentToTest person={createMinimumPersonWithIdAndName()} />);
	});

	describe('alternative names', () => {
		it('should NOT call ListWithLabel with alternative names and no label if there are no alternative names', () => {
			render(<ComponentToTest person={createMinimumPersonWithIdAndName()} />);

			expect(ListWithLabel).not.toHaveBeenCalled();
		});

		it('should call ListWithLabel with alternative names and no label if alternative names', () => {
			const person = createCompletePerson();
			render(<ComponentToTest person={person} />);

			expect(ListWithLabel).toHaveBeenCalled();
			expect(ListWithLabel).toHaveBeenLastCalledWith(
				expect.objectContaining({
					label: 'Alternativa namn (namnformer som förekommit i publikationer)',
					list: [
						'someAlternativeFamilyName, someAlternativeGivenName',
						'someOtherAlternativeFamilyName, someOtherAlternativeGivenName',
					],
				}),
				expect.any(Object)
			);
		});
	});
	describe('External URLs ', () => {
		it('should NOT call ExternalLink if externalURLs is undefined', () => {
			const person = createMinimumPersonWithIdAndName();
			render(<ComponentToTest person={person} />);

			expect(ExternalLink).not.toHaveBeenCalled();
		});

		it('should NOT call ExternalLink if externalURLs is empty', () => {
			const person = createMinimumPersonWithIdAndName();

			person.externalURLs = [];

			render(<ComponentToTest person={person} />);

			expect(ExternalLink).not.toHaveBeenCalled();
		});

		it('should call ExternalLinks for one external URL', () => {
			const person = createMinimumPersonWithIdAndName();

			person.externalURLs = [{ URL: 'someUrl', linkTitle: 'someText' }];

			render(<ComponentToTest person={person} />);

			expect(ExternalLink).toHaveBeenCalledTimes(1);
		});

		it('should call ExternalLinks for each external URL', () => {
			const person = createCompletePerson();

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
		});

		it('should display yearOfBirth, yearOfDeath and emailAddress if present', () => {
			const person = createCompletePerson();

			render(<ComponentToTest person={person} />);

			expect(screen.getByText('Födelseår')).toBeInTheDocument();
			expect(screen.getByText('1900')).toBeInTheDocument();
			expect(screen.getByText('Dödsår')).toBeInTheDocument();
			expect(screen.getByText('2000')).toBeInTheDocument();
			expect(screen.getByText('E-Post')).toBeInTheDocument();
			expect(screen.getByText('foo@bar.com')).toBeInTheDocument();
		});

		it('should not display yearOfBirth, yearOfDeath and emailAddress not if present', () => {
			const person = createMinimumPersonWithIdAndName();

			render(<ComponentToTest person={person} />);

			expect(screen.getByText('Födelseår')).toBeInTheDocument();
			expect(screen.queryByText('1900')).not.toBeInTheDocument();
			expect(screen.getByText('Dödsår')).toBeInTheDocument();
			expect(screen.queryByText('2000')).not.toBeInTheDocument();
			expect(screen.getByText('E-Post')).toBeInTheDocument();
			expect(screen.queryByText('foo@bar.com')).not.toBeInTheDocument();
		});
	});
});
