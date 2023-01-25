import React from 'react';
import { useParams } from 'react-router-dom';
import PersonEdit from './PersonEdit/PersonEdit';
import PersonFetcher from './PersonFetcher';
import FormPersonView from './FormPersonView';
import { convertToFormPerson, FormPerson } from '../../types/FormPerson';
import {
	convertToFormPersonDomainPart,
	FormPersonDomainPart,
} from '../../types/FormPersonDomainPart';

// eslint-disable-next-line react/require-default-props
const PersonPage = function ({ edit = false }: { edit?: boolean }) {
	const { personId = '' } = useParams<string>();

	if (personId === undefined || personId === '') {
		return <p>Ange ID f&ouml;r att h&auml;mta person.</p>;
	}

	return (
		<PersonFetcher id={personId}>
			{(injectedProps) => {
				const {
					person,
					organisations = [],
					personDomainParts = [],
				} = injectedProps.record;
				if (edit) {
					return (
						<PersonEdit
							originalPerson={person}
							originalOrganisations={organisations}
							originalPersonDomainParts={personDomainParts}
						/>
					);
				}

				const formPerson: FormPerson = convertToFormPerson(person);

				const initialOrganisations: Map<string, string> = new Map();

				organisations.forEach((organisation) => {
					initialOrganisations.set(
						organisation.id,
						organisation.name
					);
				});

				const initialPersonDomainPartsArr: FormPersonDomainPart[] =
					personDomainParts.map((personDomainPart) => {
						return convertToFormPersonDomainPart(personDomainPart);
					});

				return (
					<FormPersonView
						person={formPerson}
						organisations={initialOrganisations}
						personDomainParts={initialPersonDomainPartsArr}
					/>
				);
			}}
		</PersonFetcher>
	);
};

export default PersonPage;
