import styled from 'styled-components';

const baseColor = '#75598e';

type Props = { primary?: boolean };
export const Button = styled.button`
	/* Adapt the colors based on primary prop */
	background: ${(props: Props) => (props.primary ? 'var(--primary)' : 'white')};
	color: ${(props: Props) => (props.primary ? 'white' : 'var(--primary)')};

	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 2px solid var(--primary);
	border-radius: 3px;
`;
export default Button;
// return (
// 	<div>
// 		<Button>Normal</Button>
// 		<Button primary>Primary</Button>
// 	</div>
// );
