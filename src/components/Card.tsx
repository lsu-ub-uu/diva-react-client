import styled from 'styled-components';
import React from 'react';

type Props = { text: string; id: string };
const CardSection = styled.section`
	box-shadow: ${(props) => props.theme.boxShadow};
	transition: 0.3s;

	&:hover {
		box-shadow: ${(props) => props.theme.boxShadowAccent};
	}

	padding: 1em;
`;

const Card = function (props: Props) {
	const { id, text } = props;
	return (
		<CardSection role="listitem">
			<a href="/" className="headingLink">
				{text}
			</a>
			<p>{id}</p>
		</CardSection>
	);
};

export default Card;
