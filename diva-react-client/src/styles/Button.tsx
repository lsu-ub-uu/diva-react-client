import styled, { DefaultTheme } from 'styled-components';

type Props = { primary?: boolean; theme: DefaultTheme };
export const Button = styled.button`
	background: ${(props: Props) => props.theme.primary};
	color: ${(props: Props) => props.theme.secondary};

	font-size: 1em;
	padding: 0.25em 1em;
	border: 2px solid ${(props) => props.theme.primary};
	border-radius: ${(props) => props.theme.borderRadius};
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
`;
export default Button;
