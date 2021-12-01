import React from 'react';
import { ThemeProvider } from 'styled-components';
import Layout from './components/Layout/Layout';
import Main from './components/Layout/Main';
import PersonSearch from './components/PersonSearch';
import GlobalStyle from './components/styles/GlobalStyle';
import Themes from './components/styles/themes/Themes';

const App = function () {
	return (
		<ThemeProvider theme={Themes.lightTheme}>
			<>
				<GlobalStyle />
				<Layout>
					<Main>
						<PersonSearch />
					</Main>
				</Layout>
			</>
		</ThemeProvider>
	);
};

export default App;
