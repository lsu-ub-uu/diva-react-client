import { RecordType } from '../types/Record';
import { Person } from '../types/Person';
import { getRecordById } from './api';
import { PersonDomainPart } from '../types/PersonDomainPart';
import { Organisation } from '../types/Organisation';

// eslint-disable-next-line import/prefer-default-export
export function getPersonById(id: string, authToken?: string): Promise<Person> {
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
						.then((personDomainPartObjects) => {
							person.connectedDomains = personDomainPartObjects;
							resolve(person);
						})
						.catch((error) => {
							reject(error);
						});
				} else {
					resolve(person);
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
): Promise<PersonDomainPart> {
	return new Promise((resolve, reject) => {
		getRecordById<PersonDomainPart>(RecordType.PersonDomainPart, id, authToken)
			.then((personDomainPart) => {
				if (personDomainPart.affiliations !== undefined) {
					const affiliationsPromises = personDomainPart.affiliations.map(
						(affiliationHolder) => {
							return getRecordById<Organisation>(
								RecordType.Organisation,
								affiliationHolder.id,
								authToken
							).then((organisation) => {
								affiliationHolder.organisation = organisation;
								return affiliationHolder;
							});
						}
					);

					// resolve(personDomainPart);

					Promise.all(affiliationsPromises)
						.then((affiliations) => {
							personDomainPart.affiliations = affiliations;
							resolve(personDomainPart);
						})
						.catch((error) => {
							reject(error);
						});
				} else {
					resolve(personDomainPart);
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}
