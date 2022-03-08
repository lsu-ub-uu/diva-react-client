import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DefaultTheme, ThemeProvider } from 'styled-components';
// import Header from './components/Layout/Header';
import Layout from './components/Layout/Layout';
import Main from './components/Layout/Main';
import Sidebar from './components/Layout/Sidebar';
import ModeSwitcher from './components/ModeSwitcher';
import LoginButton from './components/LoginButton';
import NoMatch from './components/NoMatch';
import PersonRoot from './components/PersonRoot';
import PersonSearch from './components/PersonSearch';
import PersonPage from './components/PersonPage';
import GlobalStyle from './styles/GlobalStyle';
import Themes from './themes/Themes';
import AuthContext, { LOGIN_STATUS } from './context/AuthContext';

// const Navigation = function () {
// 	return (
// 		<nav>
// 			<Link to="/person">Personposter</Link>
// 			<Link to="/users">Användare</Link>
// 		</nav>
// 	);
// };

// const Users = function () {
// 	return (
// 		<main style={{ padding: '1rem 0' }}>
// 			<h2>Users</h2>
// 		</main>
// 	);
// };

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
		<AuthContext.Provider
			value={{ status: LOGIN_STATUS.LOGGED_OUT, token: '' }}
		>
			<ThemeProvider theme={activeTheme}>
				<>
					<GlobalStyle />
					<Layout>
						{/* <Header>
						<Navigation />
					</Header> */}

						<Sidebar>
							<ModeSwitcher darkMode={darkMode} handleClick={toggleDarkMode} />
							<LoginButton />
						</Sidebar>
						<Main>
							<Routes>
								<Route index element={<PersonSearch />} />
								<Route path="person" element={<PersonRoot />}>
									<Route index element={<PersonSearch />} />
									<Route path=":personId" element={<PersonPage />} />
								</Route>
								<Route path="*" element={<NoMatch />} />
							</Routes>
						</Main>
					</Layout>
				</>
			</ThemeProvider>
		</AuthContext.Provider>
	);
};

export default App;
