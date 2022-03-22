import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Person, Record, RecordType } from 'diva-cora-ts-api-wrapper';
import ListWithLabel from '../PersonPage/ListWithLabel';
import getDomainCollection from '../../divaData/resources';
import { getDisplayName } from '../../../tools/NameTools';

const CardSection = styled.section`
	box-shadow: ${(props) => props.theme.boxShadow};
	transition: 0.3s;
	border-radius: 3px;

	&:hover {
		box-shadow: ${(props) => props.theme.boxShadowAccent};
		border-left: 4px solid ${(props) => props.theme.primaryAccent};
	}

	padding: 1em;

	display: grid;

	grid-template-columns: min-content auto max-content;

	grid-template-areas:
		'listItemNumber title id'
		'. . orcid'
		'domain domain domain';
	row-gap: 0.4em;
	column-gap: 0.4em;
`;

const ListItemNumber = styled.p`
	grid-area: listItemNumber;
	align-self: center;
	font-size: ${(props) => props.theme.fontSizeBig};
	color: ${(props) => props.theme.grey};
`;

const Title = styled.div`
	grid-area: title;
	align-self: end;
`;

const Id = styled.p`
	grid-area: id;
	justify-self: right;
	color: ${(props) => props.theme.grey};
`;

const Orcid = styled.div`
	grid-area: orcid;
	justify-self: right;
`;

const Domain = styled.div`
	grid-area: domain;
`;

const Card = function ({
	item,
	listItemNumber,
}: {
	item: Record;
	listItemNumber: number;
}) {
	return (
		<CardSection>
			<ListItemNumber>{listItemNumber}.</ListItemNumber>
			<Title>
				<Link className="headingLink" to={`/${item.recordType}/${item.id}`}>
					{getPresentation(item)}
				</Link>
			</Title>
			<Id className="gray">{item.id}</Id>
			{possiblyShowOrcid(item)}
			{possiblyShowDomains(item)}
		</CardSection>
	);
};

const getPresentation = (item: Record) => {
	if (isPerson(item)) {
		const person: Person = item as Person;
		if (person.authorisedName === undefined) {
			return person.id;
		}
		return getDisplayName(person.authorisedName);
	}

	return `${item.recordType}: ${item.id}`;
};

const possiblyShowOrcid = (item: Record) => {
	if (isPerson(item)) {
		const person = item as Person;
		if (person.orcids && person.orcids.length > 0) {
			return (
				<Orcid>
					<ListWithLabel list={person.orcids} label="" omitEmptyStrings />
				</Orcid>
			);
		}
	}
	return null;
};

const possiblyShowDomains = (item: Record) => {
	if (isPerson(item)) {
		const person = item as Person;
		if (person.domains !== undefined && person.domains.length > 0) {
			const domainCollection = getDomainCollection();
			const domainNames = person.domains.map((domain) => {
				return domainCollection.get(domain) || domain;
			});

			return (
				<Domain>
					<ListWithLabel list={domainNames} label="" omitEmptyStrings tag />
				</Domain>
			);
		}
	}

	return null;
};

const isPerson = (item: Record) => {
	return item.recordType === RecordType.Person;
};

export default Card;
