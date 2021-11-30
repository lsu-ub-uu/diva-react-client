import React from 'react';
import { ThemeProvider } from 'styled-components';
import PersonSearch from './components/PersonSearch';
import GlobalStyle from './components/styles/GlobalStyle';
import Themes from './components/styles/themes/Themes';

const App = function () {
	return (
		<ThemeProvider theme={Themes.lightTheme}>
			<>
				<GlobalStyle /> <PersonSearch />
			</>
		</ThemeProvider>
	);
};

export default App;
