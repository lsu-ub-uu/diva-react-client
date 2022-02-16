import React from 'react';
import { Person, Name } from '../../cora/types/Person';
import ListWithLabel from './ListWithLabel';
import ExternalLink from '../ExternalLink';

const PersonalInfo = function ({ person }: { person: Person }) {
	let alternativeNames: string[] = [];
	if (person.alternativeNames !== undefined) {
		alternativeNames = person.alternativeNames.map((name) => {
			return displayName(name);
		});
	}

	return (
		<>
			{alternativeNames.length > 0 && (
				<ListWithLabel label="" list={alternativeNames} />
			)}
			{person.externalURLs !== undefined &&
				person.externalURLs.map((link) => {
					return (
						<ExternalLink key={link.URL} URL={link.URL} text={link.linkTitle} />
					);
				})}
		</>
	);
};

const displayName = (name: Name) => {
	return `${name.familyName}, ${name.givenName}`;
};

export default PersonalInfo;
