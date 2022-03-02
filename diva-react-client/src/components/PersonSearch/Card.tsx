import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Listable, Person, RecordType } from 'diva-cora-ts-api-wrapper';
import ListWithLabel from '../PersonPage/ListWithLabel';
import getDomainCollection from '../../divaData/collections';

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

	grid-template-columns: max-content auto max-content;

	grid-template-areas:
		'listItemNumber title id'
		'. . orcid'
		'domain domain domain';
	row-gap: 1em;
	column-gap: 0.5em;
`;

const ListItemNumber = styled.p`
	grid-area: listItemNumber;
	align-self: center;
`;

const Title = styled.div`
	grid-area: title;
`;

const Id = styled.p`
	grid-area: id;
	justify-self: right;
	color: ${(props) => props.theme.grey};
`;

const Orcid = styled.p`
	grid-area: orcid;
`;

const Domain = styled.p`
	grid-area: domain;
`;

const Card = function ({
	item,
	listItemNumber,
}: {
	item: Listable;
	listItemNumber: number;
}) {
	return (
		<CardSection>
			<ListItemNumber>{listItemNumber}</ListItemNumber>
			<Title>
				<Link className="headingLink" to={`/${item.recordType}/${item.id}`}>
					{getPresentation(item)}
				</Link>
			</Title>
			<Id className="gray">{item.id}</Id>
			<Domain>Foo</Domain>
			{possiblyShowOrcid(item)}
			{possiblyShowDomains(item)}
		</CardSection>
	);
};

const getPresentation = (item: Listable) => {
	if (isPerson(item)) {
		const person: Person = item as Person;
		if (person.authorisedName === undefined) {
			return person.id;
		}
		return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
	}

	return `${item.recordType}: ${item.id}`;
};

const possiblyShowOrcid = (item: Listable) => {
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

const possiblyShowDomains = (item: Listable) => {
	const person = item as Person;
	if (person.domains !== undefined && person.domains.length > 0) {
		getDomainCollection();
	}
	// if (isPerson(item)) {
	// 	const person = item as Person;
	// 	if (person.orcids && person.orcids.length > 0) {
	// 		return (
	// 			<Orcid>
	// 				<ListWithLabel list={person.orcids} label="" omitEmptyStrings />
	// 			</Orcid>
	// 		);
	// 	}
	// }
	// return null;
};

const isPerson = (item: Listable) => {
	return item.recordType === RecordType.Person;
};

export default Card;
