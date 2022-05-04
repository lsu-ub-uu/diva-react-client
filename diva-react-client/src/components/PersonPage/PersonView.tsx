import React from 'react';
import styled from 'styled-components';
import { Person } from 'diva-cora-ts-api-wrapper';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';
import AffiliationDisplay from './AffiliationDisplay';
import BackButton from '../BackButton';
import { Paragraph, Box, Heading } from 'grommet';

const StyledPersonView = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1f 1fr;
	grid-template-rows: auto;
	grid-template-areas:
		'top top top top top'
		'left left left left right'
		'main main main main main';
	row-gap: 1.3em;
`;

const Top = styled.div`
	grid-area: top;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 0.2em;
`;

const Left = styled.div`
	grid-area: left;
`;

const Right = styled.div`
	grid-area: right;
`;

const Main = styled.div`
	grid-area: main;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 1.5em;
`;

const PersonView = function ({
	person,
	showAll = false,
}: {
	person: Person;
	showAll?: boolean;
}) {
	return (
		<StyledPersonView>
			<Top>
				<h1>{displayName(person)}</h1>
				{person.academicTitle !== undefined && person.academicTitle !== '' && (
					<p data-testid="personTitle">{person.academicTitle}</p>
				)}
			</Top>
			<Left>
				<PersonalInfo person={person} />
			</Left>
			<Right>
				<Identifiers person={person} />
			</Right>
			<Main>
				{person.biographySwedish && (
					<section>
						<h2>Biografi</h2>
						<p>{person.biographySwedish}</p>
					</section>
				)}
				{showAll && person.biographyEnglish && (
					<section>
						<h2>Biography</h2>
						<p>{person.biographyEnglish}</p>
					</section>
				)}
				{person.personDomainParts !== undefined &&
					person.personDomainParts.map((part) => {
						return (
							<PersonDomainPartWrapper key={part.recordId} id={part.recordId} />
						);
					})}
				{person.otherAffiliation !== undefined && (
					<Box>
						<Heading level="4">Andra organisationer (utanför DiVA)</Heading>
						<AffiliationDisplay affiliation={person.otherAffiliation} />
					</Box>
				)}
			</Main>
			<BackButton />
		</StyledPersonView>
	);
};

const displayName = (person: Person) => {
	if (person.authorisedName === undefined) {
		return person.id;
	}
	return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
};

export default PersonView;
