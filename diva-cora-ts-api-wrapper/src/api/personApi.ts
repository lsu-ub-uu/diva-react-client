import { RecordType } from '../types/Record';
import { Person } from '../types/Person';
import { getRecordById } from './api';
import { PersonDomainPart } from '../types/PersonDomainPart';
import { Organisation } from '../types/Organisation';

export type ExtendedPersonReturnType = {
	person: Person;
	personDomainParts?: PersonDomainPart[];
	organisations?: Organisation[];
};

// eslint-disable-next-line import/prefer-default-export
export function getPersonById(
	id: string,
	authToken?: string
): Promise<ExtendedPersonReturnType> {
	return new Promise((resolve, reject) => {
		getRecordById<Person>(RecordType.Person, id, authToken)
			.then((person) => {
				if (person.personDomainParts !== undefined) {
					const pdpPromises = person.personDomainParts.map(
						(personDomainPartIdHolder) => {
							return getPersonDomainPartById(
								personDomainPartIdHolder.recordId,
								authToken
							);
						}
					);

					Promise.all(pdpPromises)
						.then((results) => {
							let personDomainParts: PersonDomainPart[] = [];
							let organisations: Organisation[] = [];

							results.forEach(({ personDomainPart, organisations: orgArr }) => {
								personDomainParts = [...personDomainParts, personDomainPart];
								if (orgArr) {
									organisations = [...organisations, ...orgArr];
								}
							});

							resolve({ person, personDomainParts, organisations });
						})
						.catch((error) => {
							reject(error);
						});
				} else {
					resolve({ person });
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getPersonDomainPartById(
	id: string,
	authToken?: string
): Promise<{
	personDomainPart: PersonDomainPart;
	organisations?: Organisation[];
}> {
	return new Promise((resolve, reject) => {
		getRecordById<PersonDomainPart>(RecordType.PersonDomainPart, id, authToken)
			.then((personDomainPart) => {
				if (personDomainPart.affiliations !== undefined) {
					const organisationPromises = personDomainPart.affiliations.map(
						(affiliation) => {
							return getRecordById<Organisation>(
								RecordType.Organisation,
								affiliation.id,
								authToken
							).then((organisation) => {
								return organisation;
							});
						}
					);

					Promise.all(organisationPromises)
						.then((organisations) => {
							resolve({ personDomainPart, organisations });
						})
						.catch((error) => {
							reject(error);
						});
				} else {
					resolve({ personDomainPart });
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}
