import React from 'react';
import styled from 'styled-components';
import { NameValueList, NameValuePair, Text } from 'grommet';
import { Person, Name } from 'diva-cora-ts-api-wrapper';
import ListWithLabel from './ListWithLabel';
import ExternalLink from '../ExternalLink';

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 0.7em;
`;

const PersonalInfo = function ({ person }: { person: Person }) {
	let alternativeNames: string[] = [];
	if (person.alternativeNames !== undefined) {
		alternativeNames = person.alternativeNames.map((name) => {
			return displayName(name);
		});
	}

	return (
		<Parent>
			{alternativeNames.length > 0 && (
				<ListWithLabel label="" list={alternativeNames} />
			)}
			{person.externalURLs !== undefined && (
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
				<NameValuePair name="Födelseår">
					<Text>{person.yearOfBirth}</Text>
				</NameValuePair>
				<NameValuePair name="Dödsår">
					<Text>{person.yearOfDeath}</Text>
				</NameValuePair>
			</NameValueList>
		</Parent>
	);
};

const displayName = (name: Name) => {
	return `${name.familyName}, ${name.givenName}`;
};

export default PersonalInfo;
