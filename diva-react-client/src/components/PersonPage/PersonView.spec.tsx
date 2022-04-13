import { render, screen } from '@testing-library/react';
import React from 'react';
import { Person } from 'diva-cora-ts-api-wrapper';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personObjectData';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';
import PersonView from './PersonView';
import AffiliationDisplay from './AffiliationDisplay';
import { renderWithRouter } from '../../../test-utils';

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

jest.mock('./PersonDomainPartWrapper', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('./AffiliationDisplay', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('PersonView', () => {
	it('should render person name', () => {
		const { rerender } = renderWithRouter(
			<ComponentToTest person={personWithDomain} />
		);
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

	it('if the person does not have an authorised name, display id', () => {
		const somePersonWithoutName: Person = {
			id: 'someId',
			recordType: 'person',
		};
		const { rerender } = renderWithRouter(
			<ComponentToTest person={somePersonWithoutName} />
		);

		expect(screen.getByRole('heading', { name: 'someId' })).toBeInTheDocument();

		const someOtherPersonWithoutName: Person = {
			id: 'someOtherId',
			recordType: 'person',
		};
		rerender(<ComponentToTest person={someOtherPersonWithoutName} />);
		expect(
			screen.getByRole('heading', { name: 'someOtherId' })
		).toBeInTheDocument();
	});

	describe('academicTitle', () => {
		it('should render title if not empty', () => {
			const person = createMinimumPersonWithIdAndName();
			person.academicTitle = 'someTitle';
			const { rerender } = renderWithRouter(
				<ComponentToTest person={person} />
			);

			expect(screen.getByText(/someTitle/i)).toBeInTheDocument();

			person.academicTitle = 'someOtherTitle';

			rerender(<ComponentToTest person={person} />);

			expect(screen.getByText(/someOtherTitle/i)).toBeInTheDocument();
		});

		it('should NOT render title if empty', () => {
			const person = createMinimumPersonWithIdAndName();
			person.academicTitle = '';
			renderWithRouter(<ComponentToTest person={person} />);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});

		it('should NOT render title if undefined', () => {
			const person = createMinimumPersonWithIdAndName();
			renderWithRouter(<ComponentToTest person={person} />);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});
	});

	it('should call Identifiers with person', () => {
		renderWithRouter(<ComponentToTest person={personWithDomain} />);

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
			renderWithRouter(
				<ComponentToTest person={createMinimumPersonWithIdAndName()} />
			);

			expect(
				screen.queryByRole('heading', { name: 'Biografi' })
			).not.toBeInTheDocument();
		});

		it('if biographySwedish, shows label "Biografi"', () => {
			renderWithRouter(<ComponentToTest person={createCompletePerson()} />);

			expect(
				screen.queryByRole('heading', { name: 'Biografi' })
			).toBeInTheDocument();
		});

		it('if biographySwedish, displays swedish biography', () => {
			const completePerson = createCompletePerson();
			renderWithRouter(<ComponentToTest person={completePerson} />);

			const biographySwedish = completePerson.biographySwedish as string;

			expect(screen.queryByText(biographySwedish)).toBeInTheDocument();
		});
	});

	describe('Other affiliation', () => {
		it('should not call AffiliationDisplay if otherAffiliation is NOT set', () => {
			renderWithRouter(
				<ComponentToTest person={createMinimumPersonWithIdAndName()} />
			);
			expect(AffiliationDisplay).not.toHaveBeenCalled();
		});

		it('should call AffiliationDisplay if otherAffiliation IS set', () => {
			const person = createCompletePerson();
			renderWithRouter(<ComponentToTest person={person} />);
			expect(AffiliationDisplay).toHaveBeenLastCalledWith(
				expect.objectContaining({ affiliation: person.otherAffiliation }),
				expect.any(Object)
			);

			const otherPerson = createMinimumPersonWithIdAndName();
			otherPerson.otherAffiliation = {
				name: 'someOtherAffiliation',
			};
			renderWithRouter(<ComponentToTest person={otherPerson} />);
			expect(AffiliationDisplay).toHaveBeenLastCalledWith(
				expect.objectContaining({ affiliation: otherPerson.otherAffiliation }),
				expect.any(Object)
			);
		});
	});

	it('should call PersonalInfo with person', () => {
		renderWithRouter(<ComponentToTest person={personWithDomain} />);

		expect(PersonalInfo).toHaveBeenCalledTimes(1);
		expect(PersonalInfo).toHaveBeenCalledWith(
			expect.objectContaining({
				person: personWithDomain,
			}),
			expect.any(Object)
		);
	});

	describe('PersonDomainParts', () => {
		it('should not render PersonDomainPartWrapper if there are no personDomainParts', () => {
			renderWithRouter(<ComponentToTest person={personWithDomain} />);

			expect(PersonDomainPartWrapper).not.toHaveBeenCalled();
		});

		it('should render PersonDomainPartWrapper for each of the personDomainParts', () => {
			const person = createCompletePerson();
			renderWithRouter(<ComponentToTest person={person} />);

			expect(PersonDomainPartWrapper).toHaveBeenCalledTimes(3);
		});

		it('should render PersonDomainPartWrapper with each of the personDomainParts', () => {
			const person = createCompletePerson();
			renderWithRouter(<ComponentToTest person={person} />);

			expect(PersonDomainPartWrapper).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					id: 'personDomainPart1',
				}),
				expect.any(Object)
			);
			expect(PersonDomainPartWrapper).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					id: 'personDomainPart2',
				}),
				expect.any(Object)
			);
			expect(PersonDomainPartWrapper).toHaveBeenNthCalledWith(
				3,
				expect.objectContaining({
					id: 'personDomainPart3',
				}),
				expect.any(Object)
			);
		});
	});
});
