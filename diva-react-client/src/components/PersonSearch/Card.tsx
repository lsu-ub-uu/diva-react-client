import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Listable, Person } from 'diva-cora-ts-api-wrapper';

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
		'fromNumber title id'
		'. . orcid'
		'domain domain domain';
	row-gap: 1em;
`;

const Title = styled.div`
	grid-area: title;
`;

const Id = styled.p`
	grid-area: id;
`;

const Domain = styled.p`
	grid-area: domain;
`;

const Card = function ({ item }: { item: Listable; listItemNumber: number }) {
	return (
		<CardSection>
			<Title>
				<Link className="headingLink" to={`/${item.recordType}/${item.id}`}>
					{getPresentation(item)}
				</Link>
			</Title>
			<Id className="gray">{item.id}</Id>
			<Domain>Foo</Domain>
		</CardSection>
	);
};

const getPresentation = (item: Listable) => {
	if (item.recordType === 'person') {
		const person: Person = item as Person;
		if (person.authorisedName === undefined) {
			return person.id;
		}
		return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
	}

	return `${item.recordType}: ${item.id}`;
};

export default Card;
