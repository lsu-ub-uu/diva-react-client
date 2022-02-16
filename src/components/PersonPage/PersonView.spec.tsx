// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personObjectData';
import ExternalLink from '../ExternalLink';
import Identifiers from './Identifiers';
import ListWithLabel from './ListWithLabel';
import PersonView from './PersonView';

jest.mock('./Identifiers', () => {
	return jest.fn(() => {
		return <div />;
	});
});

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

describe('PersonView', () => {
	it('should take a person', () => {
		render(<PersonView person={createMinimumPersonWithIdAndName()} />);
	});

	it('should render person name', () => {
		const { rerender } = render(<PersonView person={personWithDomain} />);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();

		rerender(
			<PersonView
				person={createMinimumPersonWithIdAndName(
					'someId',
					'SomeLastName',
					'SomeFirstName'
				)}
			/>
		);
		expect(
			screen.getByRole('heading', { name: 'SomeLastName, SomeFirstName' })
		).toBeInTheDocument();
	});

	describe('academicTitle', () => {
		it('should render title if not empty', () => {
			const person = createMinimumPersonWithIdAndName();
			person.academicTitle = 'someTitle';
			const { rerender } = render(<PersonView person={person} />);

			expect(screen.getByText(/someTitle/i)).toBeInTheDocument();

			person.academicTitle = 'someOtherTitle';

			rerender(<PersonView person={person} />);

			expect(screen.getByText(/someOtherTitle/i)).toBeInTheDocument();
		});

		it('should NOT render title if empty', () => {
			const person = createMinimumPersonWithIdAndName();
			person.academicTitle = '';
			render(<PersonView person={person} />);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});

		it('should NOT render title if undefined', () => {
			const person = createMinimumPersonWithIdAndName();
			render(<PersonView person={person} />);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});
	});

	describe('alternative names', () => {
		it('should NOT call ListWithLabel with alternative names and no label if there are no alternative names', () => {
			render(<PersonView person={createMinimumPersonWithIdAndName()} />);

			expect(ListWithLabel).not.toHaveBeenCalled();
		});

		it('should call ListWithLabel with alternative names and no label if alternative names', () => {
			const person = createCompletePerson();
			render(<PersonView person={person} />);

			expect(ListWithLabel).toHaveBeenCalled();
			expect(ListWithLabel).toHaveBeenLastCalledWith(
				expect.objectContaining({
					label: '',
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
			render(<PersonView person={person} />);

			expect(ExternalLink).not.toHaveBeenCalled();
		});

		it('should NOT call ExternalLink if externalURLs is empty', () => {
			const person = createMinimumPersonWithIdAndName();

			person.externalURLs = [];

			render(<PersonView person={person} />);

			expect(ExternalLink).not.toHaveBeenCalled();
		});

		it('should call ExternalLinks for one external URL', () => {
			const person = createMinimumPersonWithIdAndName();

			person.externalURLs = [{ URL: 'someUrl', linkTitle: 'someText' }];

			render(<PersonView person={person} />);

			expect(ExternalLink).toHaveBeenCalledTimes(1);
		});

		it('should call ExternalLinks for each external URL', () => {
			const person = createCompletePerson();

			render(<PersonView person={person} />);

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
	});

	it('should call Identifiers with person', () => {
		render(<PersonView person={personWithDomain} />);

		expect(Identifiers).toHaveBeenCalledTimes(1);
		expect(Identifiers).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});

	describe('biography', () => {
		it('if no biographySwedish, should not show biography', () => {
			render(<PersonView person={createMinimumPersonWithIdAndName()} />);

			expect(screen.queryByText(/Biografi/i)).not.toBeInTheDocument();
		});

		it('if biographySwedish, shows label "Biografi"', () => {
			render(<PersonView person={createCompletePerson()} />);

			expect(screen.queryByText(/Biografi/i)).toBeInTheDocument();
		});

		it('if biographySwedish, displays swedish biography', () => {
			const completePerson = createCompletePerson();
			render(<PersonView person={completePerson} />);

			const biographySwedish = completePerson.biographySwedish as string;

			expect(screen.queryByText(biographySwedish)).toBeInTheDocument();
		});
	});

	describe('Other affiliation', () => {
		it('should not display affiliation if it is not set', () => {
			render(<PersonView person={createMinimumPersonWithIdAndName()} />);
			expect(screen.queryByTestId('otherAffiliation')).not.toBeInTheDocument();
		});
		it('should display affiliation if it is set', () => {
			const person = createCompletePerson();
			const { rerender } = render(<PersonView person={person} />);

			expect(screen.getByText(/SomeOtherAffiliation/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();
			person2.otherAffiliation = {
				name: 'SomeDifferentAffiliation',
			};
			rerender(<PersonView person={person2} />);

			expect(
				screen.queryByText(/SomeOtherAffiliation/)
			).not.toBeInTheDocument();

			expect(screen.getByText(/SomeDifferentAffiliation/)).toBeInTheDocument();
		});

		it('should display affiliation years if they are set', () => {
			const person = createCompletePerson();
			const { rerender } = render(<PersonView person={person} />);

			expect(screen.getByText(/ \(2000 - 2001\)/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();

			person2.otherAffiliation = {
				name: 'SomeDifferentAffiliation',
				fromYear: '3000',
				untilYear: '4000',
			};
			rerender(<PersonView person={person2} />);

			expect(screen.queryByText(/ \(2000 - 2001\)/)).not.toBeInTheDocument();

			expect(screen.getByText(/ \(3000 - 4000\)/)).toBeInTheDocument();
		});

		it('should not display affiliationYears if they are not set', () => {
			const person = createMinimumPersonWithIdAndName();
			person.otherAffiliation = {
				name: 'SomeAffiliation',
			};
			const { rerender } = render(<PersonView person={person} />);

			expect(screen.queryByText(/ \( - \)/)).not.toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();

			person2.otherAffiliation = {
				name: 'SomeDifferentAffiliation',
			};
			rerender(<PersonView person={person2} />);

			expect(screen.queryByText(/ \( - \)/)).not.toBeInTheDocument();
		});

		it('should display fromYear if it is set', () => {
			const person = createMinimumPersonWithIdAndName();
			person.otherAffiliation = {
				name: 'SomeAffiliation',
				fromYear: '1999',
			};
			const { rerender } = render(<PersonView person={person} />);

			expect(screen.getByText(/ \(1999 - \)/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();
			person2.otherAffiliation = {
				name: 'SomeAffiliation',
				fromYear: '1234',
			};
			rerender(<PersonView person={person2} />);

			expect(screen.getByText(/ \(1234 - \)/)).toBeInTheDocument();
		});

		it('should display untilYear if it is set', () => {
			const person = createMinimumPersonWithIdAndName();
			person.otherAffiliation = {
				name: 'SomeAffiliation',
				untilYear: '1999',
			};
			const { rerender } = render(<PersonView person={person} />);

			expect(screen.getByText(/ \( - 1999\)/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();
			person2.otherAffiliation = {
				name: 'SomeAffiliation',
				untilYear: '1234',
			};
			rerender(<PersonView person={person2} />);

			expect(screen.getByText(/ \( - 1234\)/)).toBeInTheDocument();
		});
	});
});
