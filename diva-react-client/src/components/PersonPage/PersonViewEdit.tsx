import React from 'react';
import styled from 'styled-components';
import { NameValueList, NameValuePair, Text } from 'grommet';
import { Name } from 'diva-cora-ts-api-wrapper';
import Identifiers from './Identifiers';
import AffiliationDisplay from './AffiliationDisplay';
import BackButton from '../BackButton';
import { FormPerson, FormPersonDomainPart } from './PersonEdit';
import ListWithLabel from './ListWithLabel';
import ExternalLink from '../ExternalLink';
import getDomainCollection from '../../divaData/resources';

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
`;

const PersonViewEdit = function ({
	person,
	personDomainParts,
	organisations,
	showAll = false,
}: {
	person: FormPerson;
	personDomainParts: FormPersonDomainPart[];
	organisations: Map<string, string>;
	showAll?: boolean;
}) {
	return (
		<StyledPersonView>
			<Top>
				<h1>{displayName(person.authorisedName)}</h1>
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
					person.personDomainParts.map((personDomainPartId) => {
						const personDomainPart = personDomainParts.find(
							(pdp) => pdp.id === personDomainPartId
						);
						if (!personDomainPart) {
							return null;
						}

						return (
							<PersonDomainPartView
								key={personDomainPart.id}
								personDomainPart={personDomainPart}
								organisations={organisations}
							/>
						);
					})}
				{person.otherAffiliation !== undefined && (
					<AffiliationDisplay affiliation={person.otherAffiliation} />
				)}
			</Main>
			<BackButton />
		</StyledPersonView>
	);
};

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 0.7em;
`;

const PersonalInfo = function ({ person }: { person: FormPerson }) {
	const alternativeNames: string[] = person.alternativeNames.map((name) => {
		return displayName(name);
	});

	return (
		<Parent>
			{alternativeNames.length > 0 && (
				<ListWithLabel label="Alternativa namn" list={alternativeNames} />
			)}
			{person.externalURLs.length > 0 && (
				<ul>
					{person.externalURLs.map((link) => {
						return (
							<li key={link.URL}>
								<ExternalLink URL={link.URL} text={link.linkTitle} />
							</li>
						);
					})}
				</ul>
			)}
			<NameValueList nameProps={{ width: 'xsmall' }}>
				{displayNameValuePairIfNotEmptyString(person.yearOfBirth, 'Födelseår')}
				{displayNameValuePairIfNotEmptyString(person.yearOfDeath, 'Dödsår')}
				{displayNameValuePairIfNotEmptyString(person.emailAddress, 'E-Post')}
			</NameValueList>
		</Parent>
	);
};

const displayNameValuePairIfNotEmptyString = (value: string, name: string) => {
	if (value !== '') {
		return (
			<NameValuePair name={name}>
				<Text>{value}</Text>
			</NameValuePair>
		);
	}
	return null;
};

const StyledUl = styled.ul`
	padding-left: 1em;
`;

const PersonDomainPartView = function ({
	personDomainPart,
	organisations,
}: {
	personDomainPart: FormPersonDomainPart;
	organisations: Map<string, string>;
}) {
	const domainCollection = getDomainCollection();

	const title =
		domainCollection.get(personDomainPart.domain) ||
		`DomänId: ${personDomainPart.domain}`;

	return (
		<>
			<h2>{title}</h2>
			{personDomainPart.identifiers && (
				<ListWithLabel
					list={personDomainPart.identifiers}
					label="Lokal identifikator"
				/>
			)}
			{personDomainPart.affiliations && (
				<StyledUl>
					{personDomainPart.affiliations.map((affiliation) => {
						return (
							<li key={affiliation.id}>
								<AffiliationDisplay
									affiliation={{
										name: organisations.get(affiliation.id) || affiliation.id,
										fromYear: affiliation.fromYear,
										untilYear: affiliation.untilYear,
									}}
								/>
							</li>
						);
					})}
				</StyledUl>
			)}
		</>
	);
};

const displayName = (name: Name) => {
	return `${name.familyName}, ${name.givenName}`;
};

export default PersonViewEdit;
