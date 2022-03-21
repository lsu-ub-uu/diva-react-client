import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

type Props = { theme: DefaultTheme };
const SearchInput = styled.input`
	width: 50%;
	font-size: 1em;
	height: 40px;
	padding: 0 10px;
	border: 0;
	border-radius: 3px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) inset;
	background-color: ${(props: Props) => props.theme.secondary};
`;

interface SearchTextInput {
	val: string;
	action(arg: React.ChangeEvent<HTMLInputElement>): any;
	labelledbyID: string;
}

function SearchTextField({ labelledbyID, val, action }: SearchTextInput) {
	return (
		<SearchInput
			type="search"
			aria-labelledby={labelledbyID}
			onChange={action}
			value={val}
			minLength={1}
			maxLength={100}
		/>
	);
}

export default SearchTextField;
