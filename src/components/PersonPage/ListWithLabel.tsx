import React from 'react';
import styled from 'styled-components';

const StyledUl = styled.ul`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	column-gap: 1em;
`;

const ListWithLabel = function ({
	list,
	label,
	omitEmptyStrings,
}: {
	list: string[];
	label: string;
	// eslint-disable-next-line react/require-default-props
	omitEmptyStrings?: boolean;
}) {
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
					<li key={`${key}-${text}`}>{text}</li>
				))}
			</StyledUl>
		</>
	) : (
		<div />
	);
};

export default ListWithLabel;
