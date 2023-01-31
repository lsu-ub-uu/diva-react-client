import React from 'react';
import styled from 'styled-components';

const InputSearch = styled.input`
	box-sizing: border-box;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
	color: rgb(0, 0, 0);
	cursor: pointer;
	display: inline-block;
	padding: 0.5em 2.4em;
	text-align: left;
	border: 1px solid #999;
	font-size: 1em;
	height: 2.5em;
	background-image: url('/img/logo/magnifying-glass.svg');
	background-size: 32px;
	background-repeat: no-repeat;
	background-position-x: 0.4em;
	background-position-y: 50%;
`;

const SearchInput = function ({
	value,
	onChange,
}: {
	value: string;
	onChange: any;
}) {
	return (
		<InputSearch
			id='search'
			type='search'
			/* icon={<Search />}
reverse */
			placeholder='Sök med namn, ORCID eller id'
			value={value}
			onChange={onChange}
			aria-labelledby='searchButton'
		/>
	);
};
export default SearchInput;
