import React from 'react';
// import { Button } from 'grommet';
import styled from 'styled-components';

const Button = styled.button`
	background-color: rgb(51, 51, 51);
	box-sizing: border-box;
	border-radius: 4px;
	color: rgb(255, 255, 255);
	cursor: pointer;
	display: inline-block;
	padding: 0.5em 2em;
	text-align: center;
	border: none;
	font-size: 1em;
`;

const SearchButton = function () {
	return (
		<Button
			// label='Sök'
			type='submit'
			id='searchButton'
			// primary
		>
			Sök
		</Button>
	);
};

export default SearchButton;
