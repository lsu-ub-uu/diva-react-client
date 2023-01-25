import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithRouter } from '../../../../test-utils';
import {
	createCompleteFormPerson,
	createMinimumFormPersonWithIdAndName,
	formPersonWithDomain,
} from '../../../../testData/personObjectData';
import EditButton from '../../EditButton';
import Biography from '../Biography';
import FormPersonView from '../FormPersonView';
import Identifiers from '../Identifiers';
import Organisations from '../Organisations';
import OtherAffiliation from '../OtherAffiliation';
import PersonalInfo from '../PersonalInfo';
import Public from '../Public';

jest.mock('../PersonalInfo', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../Identifiers', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../Biography', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../Organisations', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../OtherAffiliation', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../Public', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../../EditButton', () => {
	return jest.fn(() => {
		return <div />;
	});
});

const ComponentToTest = FormPersonView;
const organisations = new Map<string, string>();

describe('FormPersonView', () => {
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

	describe('Biographies', () => {
		describe('Swedish', () => {
			it('should call Biography with the swedish label and the biography text', () => {
				const person = createCompleteFormPerson();
				const { rerender } = renderWithRouter(
					<ComponentToTest
						person={person}
						organisations={organisations}
						personDomainParts={[]}
					/>
				);

				expect(Biography).toHaveBeenCalledTimes(1);
				expect(Biography).toHaveBeenCalledWith(
					expect.objectContaining({
						label: 'Biografi',
						text: person.biographySwedish,
					}),
					expect.any(Object)
				);

				rerender(
					<ComponentToTest
						person={formPersonWithDomain}
						organisations={organisations}
						personDomainParts={[]}
					/>
				);

				expect(Biography).toHaveBeenCalledTimes(2);
				expect(Biography).toHaveBeenCalledWith(
					expect.objectContaining({
						label: 'Biografi',
						text: '',
					}),
					expect.any(Object)
				);
			});
		});

		describe('english', () => {
			it('should not call Biography with the english biography if showAll has not been passed', () => {
				const person = createCompleteFormPerson();
				renderWithRouter(
					<ComponentToTest
						person={person}
						organisations={organisations}
						personDomainParts={[]}
					/>
				);

				expect(Biography).toHaveBeenCalledTimes(1);
				expect(Biography).not.toHaveBeenCalledWith(
					expect.objectContaining({
						label: 'Biography',
						text: expect.any(String),
					}),
					expect.any(Object)
				);
			});

			it('should call Biography with the english biography if showAll has been passed', () => {
				const person = createCompleteFormPerson();
				const { rerender } = renderWithRouter(
					<ComponentToTest
						person={person}
						organisations={organisations}
						personDomainParts={[]}
						edit
					/>
				);

				expect(Biography).toHaveBeenCalledTimes(2);
				expect(Biography).toHaveBeenCalledWith(
					expect.objectContaining({
						label: 'Biography',
						text: person.biographyEnglish,
					}),
					expect.any(Object)
				);

				rerender(
					<ComponentToTest
						person={formPersonWithDomain}
						organisations={organisations}
						personDomainParts={[]}
						edit
					/>
				);

				expect(Biography).toHaveBeenCalledTimes(4);
				expect(Biography).toHaveBeenCalledWith(
					expect.objectContaining({
						label: 'Biography',
						text: '',
					}),
					expect.any(Object)
				);
			});
		});
	});
	it('Should call Organisations with personDomainPartIds, personDomainParts and organisations', () => {
		const person = createCompleteFormPerson();
		const personDomainParts = [
			{
				id: 'someId',
				domain: 'uu',
				identifiers: [],
				affiliations: [],
			},
		];
		const { rerender } = renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={personDomainParts}
			/>
		);

		expect(Organisations).toHaveBeenCalledTimes(1);
		expect(Organisations).toHaveBeenLastCalledWith(
			expect.objectContaining({
				personDomainPartIds: person.personDomainParts,
				personDomainParts,
				organisations,
			}),
			expect.any(Object)
		);

		const otherPerson = createCompleteFormPerson();

		otherPerson.personDomainParts.push('someOtherPDPId');
		const otherOrganisations = new Map<string, string>();
		otherOrganisations.set('someKey', 'someValue');

		const otherPersonDomainParts = [
			{
				id: 'someId',
				domain: 'uu',
				identifiers: [],
				affiliations: [],
			},
			{
				id: 'someOtherId',
				domain: 'kth',
				identifiers: [],
				affiliations: [],
			},
		];

		rerender(
			<ComponentToTest
				person={otherPerson}
				organisations={otherOrganisations}
				personDomainParts={otherPersonDomainParts}
			/>
		);

		expect(Organisations).toHaveBeenCalledTimes(2);
		expect(Organisations).toHaveBeenLastCalledWith(
			expect.objectContaining({
				personDomainPartIds: otherPerson.personDomainParts,
				personDomainParts: otherPersonDomainParts,
				organisations: otherOrganisations,
			}),
			expect.any(Object)
		);
	});

	it('Should call OtherAffiliation with otherAffiliation', () => {
		const person = createCompleteFormPerson();

		const { rerender } = renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(OtherAffiliation).toHaveBeenLastCalledWith(
			expect.objectContaining({
				affiliation: person.otherAffiliation,
			}),
			expect.any(Object)
		);

		const otherPerson = createCompleteFormPerson();
		otherPerson.otherAffiliation = {
			name: 'someAffilliation',
			fromYear: '1000',
			untilYear: '5555',
		};

		rerender(
			<ComponentToTest
				person={otherPerson}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(OtherAffiliation).toHaveBeenLastCalledWith(
			expect.objectContaining({
				affiliation: otherPerson.otherAffiliation,
			}),
			expect.any(Object)
		);
	});

	it('Calls Public with person.public', () => {
		const person = createCompleteFormPerson();

		const { rerender } = renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(Public).toHaveBeenLastCalledWith(
			expect.objectContaining({
				isPublic: person.public,
			}),
			expect.any(Object)
		);

		const otherPerson = createCompleteFormPerson();

		rerender(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);
		expect(Public).toHaveBeenLastCalledWith(
			expect.objectContaining({
				isPublic: otherPerson.public,
			}),
			expect.any(Object)
		);
	});

	it('It should call EditButton with recordType="person" and id=$id', () => {
		const person = createCompleteFormPerson();

		const { rerender } = renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(EditButton).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: 'person',
				id: person.id,
			}),
			expect.any(Object)
		);

		const otherPerson = createCompleteFormPerson();
		otherPerson.id = 'someOtherId';

		rerender(
			<ComponentToTest
				person={otherPerson}
				organisations={organisations}
				personDomainParts={[]}
			/>
		);

		expect(EditButton).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: 'person',
				id: otherPerson.id,
			}),
			expect.any(Object)
		);
	});

	it('Should not call EditButton if edit=true', () => {
		const person = createCompleteFormPerson();

		renderWithRouter(
			<ComponentToTest
				person={person}
				organisations={organisations}
				personDomainParts={[]}
				edit
			/>
		);

		expect(EditButton).not.toHaveBeenCalled();
	});
});
