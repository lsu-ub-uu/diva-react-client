import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
// import Header from './components/Layout/Header';
import Layout from './components/Layout/Layout';
import Main from './components/Layout/Main';
import Sidebar from './components/Layout/Sidebar';
import NoMatch from './components/NoMatch';
import PersonRoot from './components/PersonRoot';
import PersonSearch from './components/PersonSearch';
import PersonPage from './components/PersonPage';
import GlobalStyle from './styles/GlobalStyle';
import Themes from './themes/Themes';
import { AuthProvider } from './context/AuthContext';
import AuthComponent from './components/LoginButton/AuthComponent';

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
	return (
		<AuthProvider>
			<ThemeProvider theme={Themes.lightTheme}>
				<>
					<GlobalStyle />
					<Layout>
						{/* <Header>
						<Navigation />
					</Header> */}

						<Sidebar>
							<AuthComponent />
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
		</AuthProvider>
	);
};

export default App;
