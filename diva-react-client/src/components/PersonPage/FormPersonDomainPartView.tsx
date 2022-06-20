import { Box, Text } from 'grommet';
import React from 'react';
import styled from 'styled-components';
import getDomainCollection from '../../divaData/resources';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';
import AffiliationDisplay from './AffiliationDisplay';

const StyledUl = styled.ul`
	padding-left: 1em;
	margin: 0;
`;

const FormPersonDomainPartView = function ({
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
		<Box margin={{ bottom: 'small' }}>
			<h3>{title}</h3>
			{personDomainPart.identifiers && (
				<Text size="small">
					Lokal identifikator: {personDomainPart.identifiers[0]}
				</Text>
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
		</Box>
	);
};

export default FormPersonDomainPartView;
