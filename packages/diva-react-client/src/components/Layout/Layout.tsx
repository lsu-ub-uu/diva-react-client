import styled from 'styled-components';

const Layout = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 2fr 1fr;
	grid-template-rows: auto;
	grid-template-areas:
		'. header header header header'
		'. main main main sidebar'
		'footer footer footer footer footer';
`;

export default Layout;
