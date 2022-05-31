import React from 'react';
import { NameValueList, NameValuePair, Text } from 'grommet';
import { Person } from 'diva-cora-ts-api-wrapper';
import { FormPerson } from '../../types/FormPerson';

const possiblyOutputListWithLabel = (
	list: string[] | undefined,
	label: string
) => {
	if (list !== undefined && list.length > 0) {
		return list
			.filter((item) => {
				return item !== '';
			})
			.map((item) => {
				return (
					<NameValuePair name={label} key={item}>
						<Text>{item}</Text>
					</NameValuePair>
				);
			});
	}
	return undefined;
};

const Identifiers = function ({ person }: { person: Person | FormPerson }) {
	return (
		<NameValueList nameProps={{ width: 'xsmall' }}>
			<NameValuePair name="pID">
				<Text>{person.id}</Text>
			</NameValuePair>
			{possiblyOutputListWithLabel(person.orcids, 'ORCID')}

			{possiblyOutputListWithLabel(person.viafIDs, 'VIAF')}

			{possiblyOutputListWithLabel(person.librisIDs, 'Libris-id')}
		</NameValueList>
	);
};

export default Identifiers;
