import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import Button from '../styles/Button';

const SearchInput = styled.input`
	width: 100%;
	font-size: 1em;
	height: 40px;
	padding: 0 10px;
	border: 0;
	border-radius: 3px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) inset;
	background-color: ${(props: { theme: DefaultTheme }) =>
		props.theme.secondary};
`;

const StyledForm = styled.form`
	display: grid;
	grid-template-columns: 50% min-content;
	grid-template-rows: 1fr;
	justify-content: left;
	justify-items: left;
	column-gap: 1em;
`;

const SearchComponent = function ({
	value,
	onValueChange,
	onSubmit,
}: {
	value: string;
	onValueChange: (newValue: string) => void;
	onSubmit: () => void;
}) {
	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onValueChange(event.target.value);
		},
		[onValueChange]
	);

	const handleSubmit = React.useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			onSubmit();
		},
		[onSubmit]
	);
	return (
		<StyledForm onSubmit={handleSubmit}>
			<SearchInput
				type="search"
				aria-labelledby="searchButton"
				minLength={1}
				maxLength={100}
				value={value}
				onChange={handleChange}
			/>
			<Button type="submit" id="searchButton" primary>
				Sök
			</Button>
		</StyledForm>
	);
};

export default SearchComponent;
