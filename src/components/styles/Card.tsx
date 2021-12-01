import styled, { DefaultTheme } from 'styled-components';
import React from 'react';
import Name from '../../control/Name';
type Props = { personName: Name; personID: string };
const CardSection = styled.section`
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	transition: 0.3s;

	&:hover {
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
	}

	padding: 1em;
`;

const Card = function (props: Props) {
	const { personName, personID } = props;
	return (
		<CardSection role="listitem" className="card">
			<div>
				<div className="container">
					<a className="headingLink" href="/foo">
						{personName.familyName}, {personName.givenName}
					</a>
				</div>
			</div>
			<div>{personID}</div>
		</CardSection>
	);
};

export default Card;
