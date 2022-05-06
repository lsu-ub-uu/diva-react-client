import React from 'react';
import styled from 'styled-components';

const StyledUl = styled.ul`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	column-gap: 1em;
	list-style: none;
`;
const Tag = styled.li`
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.secondary};
	padding: 0.15em 0.3em;
	font-size: 0.9em;
	border-radius: ${(props) => props.theme.borderRadius};
`;

const PlainLi = styled.li``;

const ListWithLabel = function ({
	list,
	label,
	omitEmptyStrings,
	tag,
}: {
	list: string[];
	label: string;
	// eslint-disable-next-line react/require-default-props
	omitEmptyStrings?: boolean;
	// eslint-disable-next-line react/require-default-props
	tag?: boolean;
}) {
	const StyledLi = tag ? Tag : PlainLi;

	let listToDisplay = list;
	if (omitEmptyStrings) {
		listToDisplay = list.filter((element) => {
			return element !== '';
		});
	}

	return listToDisplay.length > 0 ? (
		<>
			{label !== '' && <b>{label}:</b>}
			<StyledUl>
				{listToDisplay.map((text, key) => (
					// eslint-disable-next-line react/no-array-index-key
					<StyledLi key={`${key}-${text}`}>{text}</StyledLi>
				))}
			</StyledUl>
		</>
	) : null;
};

export default ListWithLabel;
