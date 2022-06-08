import { screen } from '@testing-library/react';
import React from 'react';
import {
	createCompleteFormPerson,
	createMinimumFormPersonWithIdAndName,
	formPersonWithDomain,
} from '../../../testData/personObjectData';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';
import AffiliationDisplay from './AffiliationDisplay';
import { renderWithRouter } from '../../../test-utils';
import PersonViewEdit from './PersonViewEdit';
import { FormPerson } from '../../types/FormPerson';

const ComponentToTest = PersonViewEdit;

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

const organisations = new Map<string, string>();

describe('PersonView', () => {
	it('should render person name', () => {
		const { rerender } = renderWithRouter(
			<ComponentToTest
				person={formPersonWithDomain}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(screen.getByText(/Enequist, Gerd/i)).toBeInTheDocument();

		rerender(
			<ComponentToTest
				person={createMinimumFormPersonWithIdAndName(
					'someId',
					'SomeLastName',
					'SomeFirstName'
				)}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(
			screen.getByRole('heading', { name: 'SomeLastName, SomeFirstName' })
		).toBeInTheDocument();

		screen.getByRole('');
	});

	it('should render person public yes', () => {
		const person = createCompleteFormPerson();
		renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(screen.queryByTestId('public')).toBeInTheDocument();
		expect(screen.queryByTestId('public')).toHaveTextContent('Ja');
	});

	it('should render person public no', () => {
		const person = createCompleteFormPerson();
		person.public = 'no';
		renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(screen.queryByTestId('public')).toBeInTheDocument();
		expect(screen.queryByTestId('public')).toHaveTextContent('Nej');
	});

	it('if the person does not have an authorised name, display id', () => {
		const somePersonWithoutName: FormPerson = {
			id: 'someId',
			personDomainParts: [],
			public: 'yes',
			domains: [],
			authorisedName: {
				familyName: '',
				givenName: '',
			},
			academicTitle: '',
			yearOfBirth: '',
			yearOfDeath: '',
			emailAddress: '',
			alternativeNames: [],
			externalURLs: [],
			otherAffiliation: {
				name: '',
				fromYear: '',
				untilYear: '',
			},
			orcids: [],
			viafIDs: [],
			librisIDs: [],
			biographyEnglish: '',
			biographySwedish: '',
		};
		const { rerender } = renderWithRouter(
			<ComponentToTest
				person={somePersonWithoutName}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(screen.getByRole('heading', { name: 'someId' })).toBeInTheDocument();

		const someOtherPersonWithoutName: FormPerson = {
			id: 'someOtherId',
			personDomainParts: [],
			public: 'yes',
			domains: [],
			authorisedName: {
				familyName: '',
				givenName: '',
			},
			academicTitle: '',
			yearOfBirth: '',
			yearOfDeath: '',
			emailAddress: '',
			alternativeNames: [],
			externalURLs: [],
			otherAffiliation: {
				name: '',
				fromYear: '',
				untilYear: '',
			},
			orcids: [],
			viafIDs: [],
			librisIDs: [],
			biographyEnglish: '',
			biographySwedish: '',
		};
		rerender(
			<ComponentToTest
				person={someOtherPersonWithoutName}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(
			screen.getByRole('heading', { name: 'someOtherId' })
		).toBeInTheDocument();
	});

	describe('academicTitle', () => {
		it('should render title if not empty', () => {
			const person = createMinimumFormPersonWithIdAndName();
			person.academicTitle = 'someTitle';
			const { rerender } = renderWithRouter(
				<ComponentToTest
					person={person}
					organisations={organisations}
					personDomainParts={[]}
				/>
			);

			expect(screen.getByText(/someTitle/i)).toBeInTheDocument();

			person.academicTitle = 'someOtherTitle';

			rerender(
				<ComponentToTest
					person={person}
					organisations={organisations}
					personDomainParts={[]}
				/>
			);

			expect(screen.getByText(/someOtherTitle/i)).toBeInTheDocument();
		});

		it('should NOT render title if empty', () => {
			const person = createMinimumFormPersonWithIdAndName();
			person.academicTitle = '';
			renderWithRouter(
				<ComponentToTest
					person={person}
					organisations={organisations}
					personDomainParts={[]}
				/>
			);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});

		it('should NOT render title if undefined', () => {
			const person = createMinimumFormPersonWithIdAndName();
			renderWithRouter(
				<ComponentToTest
					person={person}
					organisations={organisations}
					personDomainParts={[]}
				/>
			);

			expect(screen.queryByTestId('personTitle')).not.toBeInTheDocument();
		});
	});
});

it('should call Identifiers with person', () => {
	renderWithRouter(
		<ComponentToTest
			person={formPersonWithDomain}
			organisations={organisations}
			personDomainParts={[]}
		/>
	);

	expect(Identifiers).toHaveBeenCalledTimes(1);
	expect(Identifiers).toHaveBeenCalledWith(
		expect.objectContaining({
			person: formPersonWithDomain,
		}),
		expect.any(Object)
	);
});

describe('biography', () => {
	it('if no biographySwedish, should not show biography', () => {
		renderWithRouter(
			<ComponentToTest
				person={createMinimumFormPersonWithIdAndName()}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(
			screen.queryByRole('heading', { name: 'Biografi' })
		).not.toBeInTheDocument();
	});

	it('if biographySwedish, shows label "Biografi"', () => {
		renderWithRouter(
			<ComponentToTest
				person={createCompleteFormPerson()}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(
			screen.queryByRole('heading', { name: 'Biografi' })
		).toBeInTheDocument();
	});

	it('if biographySwedish, displays swedish biography', () => {
		const completePerson = createCompleteFormPerson();
		renderWithRouter(
			<ComponentToTest
				person={completePerson}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		const biographySwedish = completePerson.biographySwedish as string;

		expect(screen.queryByText(biographySwedish)).toBeInTheDocument();
	});
});

describe('Other affiliation', () => {
	it('should not call AffiliationDisplay if otherAffiliation is NOT set', () => {
		renderWithRouter(
			<ComponentToTest
				person={createMinimumFormPersonWithIdAndName()}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(AffiliationDisplay).not.toHaveBeenCalled();
	});

	it('should call AffiliationDisplay if otherAffiliation IS set', () => {
		const person = createCompleteFormPerson();
		renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(AffiliationDisplay).toHaveBeenLastCalledWith(
			expect.objectContaining({ affiliation: person.otherAffiliation }),
			expect.any(Object)
		);

		const otherPerson = createMinimumFormPersonWithIdAndName();
		otherPerson.otherAffiliation = {
			name: 'someOtherAffiliation',
			fromYear: '1990',
			untilYear: '2000',
		};
		renderWithRouter(
			<ComponentToTest
				person={otherPerson}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(AffiliationDisplay).toHaveBeenLastCalledWith(
			expect.objectContaining({ affiliation: otherPerson.otherAffiliation }),
			expect.any(Object)
		);
	});
});

it('should call PersonalInfo with person', () => {
	renderWithRouter(
		<ComponentToTest
			person={formPersonWithDomain}
			organisations={organisations}
			personDomainParts={[]}
		/>
	);

	expect(PersonalInfo).toHaveBeenCalledTimes(1);
	expect(PersonalInfo).toHaveBeenCalledWith(
		expect.objectContaining({
			person: formPersonWithDomain,
		}),
		expect.any(Object)
	);
});

describe('PersonDomainParts', () => {
	it('should not render PersonDomainPartWrapper if there are no personDomainParts', () => {
		renderWithRouter(
			<ComponentToTest
				person={formPersonWithDomain}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(PersonDomainPartWrapper).not.toHaveBeenCalled();
	});

	it('should render PersonDomainPartWrapper for each of the personDomainParts', () => {
		const person = createCompleteFormPerson();
		renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(PersonDomainPartWrapper).toHaveBeenCalledTimes(3);
	});

	it('should render PersonDomainPartWrapper with each of the personDomainParts', () => {
		const person = createCompleteFormPerson();
		renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

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
