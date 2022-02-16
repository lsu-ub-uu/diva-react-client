// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personObjectData';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo';
import PersonView from './PersonView';

const ComponentToTest = PersonView;

jest.mock('./Identifiers', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('./PersonalInfo', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('PersonView', () => {
	it('should render person name', () => {
		const { rerender } = render(<ComponentToTest person={personWithDomain} />);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();

		rerender(
			<ComponentToTest
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
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.getByText(/someTitle/i)).toBeInTheDocument();

			person.academicTitle = 'someOtherTitle';

			rerender(<ComponentToTest person={person} />);

			expect(screen.getByText(/someOtherTitle/i)).toBeInTheDocument();
		});

		it('should NOT render title if empty', () => {
			const person = createMinimumPersonWithIdAndName();
			person.academicTitle = '';
			render(<ComponentToTest person={person} />);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});

		it('should NOT render title if undefined', () => {
			const person = createMinimumPersonWithIdAndName();
			render(<ComponentToTest person={person} />);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});
	});

	it('should call Identifiers with person', () => {
		render(<ComponentToTest person={personWithDomain} />);

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
			render(<ComponentToTest person={createMinimumPersonWithIdAndName()} />);

			expect(
				screen.queryByRole('heading', { name: 'Biografi' })
			).not.toBeInTheDocument();
		});

		it('if biographySwedish, shows label "Biografi"', () => {
			render(<ComponentToTest person={createCompletePerson()} />);

			expect(
				screen.queryByRole('heading', { name: 'Biografi' })
			).toBeInTheDocument();
		});

		it('if biographySwedish, displays swedish biography', () => {
			const completePerson = createCompletePerson();
			render(<ComponentToTest person={completePerson} />);

			const biographySwedish = completePerson.biographySwedish as string;

			expect(screen.queryByText(biographySwedish)).toBeInTheDocument();
		});
	});

	describe('Other affiliation', () => {
		it('should not display affiliation if it is not set', () => {
			render(<ComponentToTest person={createMinimumPersonWithIdAndName()} />);
			expect(screen.queryByTestId('otherAffiliation')).not.toBeInTheDocument();
		});
		it('should display affiliation if it is set', () => {
			const person = createCompletePerson();
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.getByText(/SomeOtherAffiliation/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();
			person2.otherAffiliation = {
				name: 'SomeDifferentAffiliation',
			};
			rerender(<ComponentToTest person={person2} />);

			expect(
				screen.queryByText(/SomeOtherAffiliation/)
			).not.toBeInTheDocument();

			expect(screen.getByText(/SomeDifferentAffiliation/)).toBeInTheDocument();
		});

		it('should display affiliation years if they are set', () => {
			const person = createCompletePerson();
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.getByText(/ \(2000 - 2001\)/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();

			person2.otherAffiliation = {
				name: 'SomeDifferentAffiliation',
				fromYear: '3000',
				untilYear: '4000',
			};
			rerender(<ComponentToTest person={person2} />);

			expect(screen.queryByText(/ \(2000 - 2001\)/)).not.toBeInTheDocument();

			expect(screen.getByText(/ \(3000 - 4000\)/)).toBeInTheDocument();
		});

		it('should not display affiliationYears if they are not set', () => {
			const person = createMinimumPersonWithIdAndName();
			person.otherAffiliation = {
				name: 'SomeAffiliation',
			};
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.queryByText(/ \( - \)/)).not.toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();

			person2.otherAffiliation = {
				name: 'SomeDifferentAffiliation',
			};
			rerender(<ComponentToTest person={person2} />);

			expect(screen.queryByText(/ \( - \)/)).not.toBeInTheDocument();
		});

		it('should display fromYear if it is set', () => {
			const person = createMinimumPersonWithIdAndName();
			person.otherAffiliation = {
				name: 'SomeAffiliation',
				fromYear: '1999',
			};
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.getByText(/ \(1999 - \)/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();
			person2.otherAffiliation = {
				name: 'SomeAffiliation',
				fromYear: '1234',
			};
			rerender(<ComponentToTest person={person2} />);

			expect(screen.getByText(/ \(1234 - \)/)).toBeInTheDocument();
		});

		it('should display untilYear if it is set', () => {
			const person = createMinimumPersonWithIdAndName();
			person.otherAffiliation = {
				name: 'SomeAffiliation',
				untilYear: '1999',
			};
			const { rerender } = render(<ComponentToTest person={person} />);

			expect(screen.getByText(/ \( - 1999\)/)).toBeInTheDocument();

			const person2 = createMinimumPersonWithIdAndName();
			person2.otherAffiliation = {
				name: 'SomeAffiliation',
				untilYear: '1234',
			};
			rerender(<ComponentToTest person={person2} />);

			expect(screen.getByText(/ \( - 1234\)/)).toBeInTheDocument();
		});
	});

	it('should call PersonalInfo with person', () => {
		render(<ComponentToTest person={personWithDomain} />);

		expect(PersonalInfo).toHaveBeenCalledTimes(1);
		expect(PersonalInfo).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});
});
