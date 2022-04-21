import { RecordType } from '../types/Record';
import { Person } from '../types/Person';
import { getRecordById } from './api';
import { PersonDomainPart } from '../types/PersonDomainPart';

// eslint-disable-next-line import/prefer-default-export
export function getPersonById(id: string, authToken?: string): Promise<Person> {
	return new Promise((resolve, reject) => {
		getRecordById<Person>(RecordType.Person, id, authToken)
			.then((person) => {
				if (person.personDomainParts !== undefined) {
					const pdpPromises = person.personDomainParts.map(
						(personDomainPartIdHolder) => {
							return getRecordById<PersonDomainPart>(
								RecordType.PersonDomainPart,
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
