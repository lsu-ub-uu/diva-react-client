import React from 'react';
import styled from 'styled-components';

export const SearchInput = styled.input`
	width: 50%;
	font-size: 1em;
	font-family:Arial;
	height: 40px;
	padding: 0 10px;
	border: 0;
	border-radius: 3px;
	box-shadow: 0 1px 2px rgba(0,0,0,0.4) inset;
	background-color: #f8f8f8;
`;

interface SearchTextInput{
	val: string;
	action(arg:React.ChangeEvent<HTMLInputElement>):any;
	labelledbyID:string;
}

function SearchTextField(props:SearchTextInput){
	return(
	<SearchInput type="search" 
		aria-labelledby={props.labelledbyID} 
		onChange={props.action} 
		value={props.val}
		minLength={1}
		maxLength={100}/>
	);
}

export default SearchTextField;

