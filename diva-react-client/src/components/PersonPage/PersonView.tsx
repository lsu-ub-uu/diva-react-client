import React from 'react';
import styled from 'styled-components';
import { Box, Button, Heading } from 'grommet';
import { Link } from 'react-router-dom';
import { Edit } from 'grommet-icons';
import { Person } from 'diva-cora-ts-api-wrapper';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';
import AffiliationDisplay from './AffiliationDisplay';
import BackButton from '../BackButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';

const StyledPersonView = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1f 1fr;
	grid-template-rows: auto;
	grid-template-areas:
		'top top top top top'
		'left left left left right'
		'main main main main main'
		'bottom bottom bottom bottom bottom';
	row-gap: 1.3em;
`;

const Top = styled.div`
	grid-area: top;
	display: grid;
	grid-template-columns: 2fr;
	grid-template-rows: 1fr;
	align-items: center;
	column-gap: 0.2em;
`;

const Left = styled.div`
	grid-area: left;
`;

const Right = styled.div`
	grid-area: right;
`;

const Bottom = styled.footer`
	grid-area: bottom;
	grid-template-columns: 1fr;
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
	// eslint-disable-next-line react/require-default-props
	showAll?: boolean;
}) {
	const { auth } = useAuth();

	return (
		<StyledPersonView>
			<Top>
				<Box direction="row-responsive">
					<h1>{displayName(person)}</h1>
					<Box margin={{ top: '0.5em' }}>
						{auth.status === LOGIN_STATUS.LOGGED_IN && (
							<Link
								to={`/${person.recordType}/edit/${person.id}`}
								style={{ justifySelf: 'start' }}
							>
								<Button icon={<Edit />} a11yTitle="Editera" />
							</Link>
						)}
					</Box>
				</Box>

				<Box>
					{person.academicTitle !== undefined &&
						person.academicTitle !== '' && (
							<p data-testid="personTitle">{person.academicTitle}</p>
						)}
				</Box>
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
				<h2>Organisationer</h2>
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

				{person.public !== undefined && person.public !== '' && (
					<Box>
						<Heading level="4">Publik</Heading>
						<p data-testid="public">{displayPublicYesOrNo(person)}</p>
					</Box>
				)}
			</Main>
			<Bottom>
				<BackButton />
			</Bottom>
		</StyledPersonView>
	);
};

const displayName = (person: Person) => {
	if (person.authorisedName === undefined) {
		return person.id;
	}
	return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
};

const displayPublicYesOrNo = (person: Person) => {
	if (person.public && person.public === 'yes') {
		return 'Ja';
	}
	return 'Nej';
};

export default PersonView;
