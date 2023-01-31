import styled /* { DefaultTheme } */ from 'styled-components';

// type Props = { primary?: boolean; theme: DefaultTheme };
export const Select = styled.select`
	box-sizing: border-box;
	border-radius: 4px;
	color: rgb(0, 0, 0);
	cursor: pointer;
	display: inline-block;
	padding: 0.5em 0.5em;
	text-align: left;
	border: 1px solid #999;
	font-size: 1em;
	height: 2.5em;
	width: 5em;
	background-color: rgb(255, 255, 255);
`;
/* export const Select = styled.select`
	background: ${(props: Props) => props.theme.primary};
	color: ${(props: Props) => props.theme.secondary};

	font-size: 1em;
	padding-left: 0.6em;
	border: 2px solid ${(props) => props.theme.primary};
	border-radius: 3px;
	height: 40px;
	transition: background-color 0.25s ease-out, color 0.25s ease-out;

	&:hover {
		background: ${(props) => props.theme.primaryAccent};
		border: 2px solid ${(props) => props.theme.primaryAccent};
	}

	&:disabled {
		background: ${(props) => props.theme.grey};
		border-color: ${(props) => props.theme.grey};
	}
`; */
export default Select;
