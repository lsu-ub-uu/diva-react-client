import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import Listable from '../control/Listable';

const CardSection = styled.section`
	box-shadow: ${(props) => props.theme.boxShadow};
	transition: 0.3s;
	border-radius: 3px;

	&:hover {
		box-shadow: ${(props) => props.theme.boxShadowAccent};
		border-left: 4px solid ${(props) => props.theme.primaryAccent};
	}

	padding: 1em;
`;
type Props = {
	item: Listable;
};
const Card = function ({ item }: Props) {
	return (
		<CardSection>
			<Link className="headingLink" to={item.getLink()}>
				{item.presentation()}
			</Link>
			<p className="gray">{item.id}</p>
		</CardSection>
	);
};

export default Card;
