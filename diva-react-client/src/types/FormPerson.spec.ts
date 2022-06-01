import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
} from '../../testData/personObjectData';
import { convertToFormPerson, FormPerson } from './FormPerson';

describe('FormPerson', () => {
	describe('convertToFormPerson', () => {
		it('converts a minimal person Object', () => {
			const minimalPerson = createMinimumPersonWithIdAndName(
				'someId',
				'familyName',
				'givenName'
			);
			minimalPerson.public = 'no';
			const expectedFormPerson: FormPerson = {
				id: 'someId',
				authorisedName: { familyName: 'familyName', givenName: 'givenName' },
				personDomainParts: [],
				public: 'no',
				academicTitle: '',
				domains: [],
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

			const formPerson: FormPerson = convertToFormPerson(minimalPerson);

			expect(formPerson).toStrictEqual(expectedFormPerson);
		});

		it('converts a maximal person Object', () => {
			const completePerson = createCompletePerson();

			const expectedFormPerson: FormPerson = {
				id: 'somePID',
				authorisedName: { familyName: 'Celsius', givenName: 'Anders' },
				personDomainParts: [
					'personDomainPart1',
					'personDomainPart2',
					'personDomainPart3',
				],
				public: 'yes',
				academicTitle: 'someTitle',
				orcids: ['someOrcid', 'someOtherOrcid'],
				viafIDs: ['someViaf', 'someOtherViaf'],
				librisIDs: ['someLibris', 'someOtherLibris'],
				domains: ['someDomain', 'someOtherDomain'],
				alternativeNames: [
					{
						content: {
							familyName: 'someAlternativeFamilyName',
							givenName: 'someAlternativeGivenName',
						},
						repeatId: 0,
					},
					{
						content: {
							familyName: 'someOtherAlternativeFamilyName',
							givenName: 'someOtherAlternativeGivenName',
						},
						repeatId: 1,
					},
				],
				externalURLs: [
					{ content: { URL: 'http://du.se', linkTitle: 'DU' }, repeatId: 0 },
					{
						content: { URL: 'http://uu.se', linkTitle: 'Uppsala Universitet' },
						repeatId: 1,
					},
				],
				biographySwedish: 'A nice biography<br/> foobar',
				otherAffiliation: {
					name: 'SomeOtherAffiliation',
					fromYear: '2000',
					untilYear: '2001',
				},
				yearOfBirth: '1900',
				yearOfDeath: '2000',
				emailAddress: 'foo@bar.com',
				biographyEnglish: 'A nice biography in English<br/> foobar',
			};

			const formPerson: FormPerson = convertToFormPerson(completePerson);

			expect(formPerson).toStrictEqual(expectedFormPerson);
		});
	});
});
