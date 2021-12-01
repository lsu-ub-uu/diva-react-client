import React, { useState } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import Layout from './components/Layout/Layout';
import Main from './components/Layout/Main';
import Sidebar from './components/Layout/Sidebar';
import ModeSwitcher from './components/ModeSwitcher';
import PersonSearch from './components/PersonSearch';
import GlobalStyle from './components/styles/GlobalStyle';
import Themes from './components/styles/themes/Themes';

const App = function () {
	const [activeTheme, setActiveTheme] = useState<DefaultTheme>(
		Themes.lightTheme
	);
	const [darkMode, setDarkMode] = useState<boolean>(false);

	const toggleDarkMode = React.useCallback(() => {
		if (darkMode) {
			setActiveTheme(Themes.lightTheme);
		} else {
			setActiveTheme(Themes.darkTheme);
		}
		setDarkMode(!darkMode);
	}, [darkMode]);

	return (
		<ThemeProvider theme={activeTheme}>
			<>
				<GlobalStyle />
				<Layout>
					<Sidebar>
						<ModeSwitcher darkMode={darkMode} handleClick={toggleDarkMode} />
					</Sidebar>
					<Main>
						<PersonSearch />
					</Main>
				</Layout>
			</>
		</ThemeProvider>
	);
};

export default App;
