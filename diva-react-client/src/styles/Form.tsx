import styled from 'styled-components';

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	/* grid-template-columns: 50% min-content;
	grid-template-rows: 1fr;
	justify-content: left;
	justify-items: left;
	column-gap: 1em;
	row-gap: 0.5em; */
	width: 50vw;
	gap: 0.5em;
	div {
		display: flex;
		grid-column: span 2;
	}
`;
export default Form;
