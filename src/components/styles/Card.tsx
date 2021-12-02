import styled from 'styled-components';
import React from 'react';

type Props = { text: string; id: string };
const CardSection = styled.section`
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	transition: 0.3s;

	&:hover {
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
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
