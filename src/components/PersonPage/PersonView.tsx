import React from 'react';
import styled from 'styled-components';
import { Person } from '../../cora/types/Person';
import Identifiers from './Identifiers';
import PersonalInfo from './PersonalInfo';

const StyledPersonView = styled.div`
	display: grid;
	grid-template-columns: '1fr 1fr 1fr 1f 1fr';
	grid-template-rows: auto;
	grid-template-areas:
		'top top top top top'
		'left left left right right'
		'main main main main main';
	row-gap: 1em;
`;

const Top = styled.div`
	grid-area: top;
`;

const Left = styled.div`
	grid-area: left;
`;

const Right = styled.div`
	grid-area: right;
`;

const Main = styled.div`
	grid-area: main;
`;

const PersonView = function ({ person }: { person: Person }) {
	const possiblyGetOtherAffiliationText = () => {
		if (person.otherAffiliation === undefined) {
			return undefined;
		}
		const affiliation = person.otherAffiliation;

		let otherAffiliationText = person.otherAffiliation.name;

		if (affiliation.fromYear || affiliation.untilYear) {
			otherAffiliationText += ` (${displayYear(
				affiliation.fromYear
			)} - ${displayYear(affiliation.untilYear)})`;
		}

		return otherAffiliationText;
	};

	return (
		<StyledPersonView>
			<Top>
				<h1>{displayName(person)}</h1>
				{person.academicTitle !== undefined && person.academicTitle !== '' && (
					<section data-testid="personTitle">{person.academicTitle}</section>
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
				{possiblyGetOtherAffiliationText() && (
					<div data-testid="otherAffiliation">
						{possiblyGetOtherAffiliationText()}
					</div>
				)}
			</Main>
		</StyledPersonView>
	);
};

const displayName = (person: Person) => {
	return `${person.authorisedName.familyName}, ${person.authorisedName.givenName}`;
};

const displayYear = (year: string | undefined) => {
	return year !== undefined ? year : '';
};

export default PersonView;
