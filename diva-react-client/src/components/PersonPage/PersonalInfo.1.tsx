import React from 'react';
import styled from 'styled-components';
import { NameValueList, NameValuePair, Text } from 'grommet';
import { Name } from 'diva-cora-ts-api-wrapper';
import ExternalLink from '../ExternalLink';
import { FormPerson } from '../../types/FormPerson';

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

const displayName = (name: Name) => {
	return `${name.familyName}, ${name.givenName}`;
};

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 0.7em;
`;

export const PersonalInfo = function ({ person }: { person: FormPerson }) {
	const alternativeNames: string[] = person.alternativeNames.map(
		({ content: name }) => {
			return displayName(name);
		}
	);

	return (
		<Parent>
			{alternativeNames.length > 0 && (
				// <ListWithLabel
				// 	label="Alternativa namn (namnformer som förekommit i publikationer)"
				// 	list={alternativeNames}
				// />
				<ul>
					{person.alternativeNames.map(({ content: name, repeatId }) => {
						return <li key={repeatId}>{displayName(name)}</li>;
					})}
				</ul>
			)}
			{person.externalURLs.length > 0 && (
				<ul>
					{person.externalURLs.map(({ content: link, repeatId }) => {
						return (
							<li key={repeatId}>
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

export default PersonalInfo;
