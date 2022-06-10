import { Name } from 'diva-cora-ts-api-wrapper';
import { Box, Heading } from 'grommet';
import React from 'react';
import { FormPerson } from '../../types/FormPerson';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';
import Biography from './Biography';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo.1';

export const FormPersonView = function ({
	person,
	personDomainParts,
	organisations,
	showAll = false,
}: {
	person: FormPerson;
	personDomainParts: FormPersonDomainPart[];
	organisations: Map<string, string>;
	// eslint-disable-next-line react/require-default-props
	showAll?: boolean;
}) {
	return (
		<Box direction="column">
			<Heading level={3}>{displayName(person.authorisedName)}</Heading>
			{person.academicTitle !== undefined && person.academicTitle !== '' && (
				<p data-testid="personTitle">{person.academicTitle}</p>
			)}
			<PersonalInfo person={person} />
			<Identifiers person={person} />
			<Biography label="Biografi" text={person.biographySwedish} />
			{showAll && (
				<Biography label="Biography" text={person.biographyEnglish} />
			)}
		</Box>
	);
};

const displayName = (name: Name) => {
	return `${name.familyName}, ${name.givenName}`;
};

export default FormPersonView;
