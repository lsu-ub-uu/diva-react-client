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
}: {
	list: string[];
	label: string;
}) {
	return list.length > 0 ? (
		<>
			{label !== '' && <b>{label}:</b>}
			<StyledUl>
				{list.map((id) => (
					<li key={id}>{id}</li>
				))}
			</StyledUl>
		</>
	) : (
		<div />
	);
};

export default ListWithLabel;
