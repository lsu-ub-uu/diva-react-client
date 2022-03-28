import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import { ThemeProvider } from 'styled-components';
import { Grommet } from 'grommet';
// import Header from './components/Layout/Header';
import Layout from './components/Layout/Layout';
import Main from './components/Layout/Main';
import Sidebar from './components/Layout/Sidebar';
import NoMatch from './components/NoMatch';
import PersonRoot from './components/PersonRoot';
import PersonSearch from './components/PersonSearch';
import PersonPage from './components/PersonPage';
// import GlobalStyle from './styles/GlobalStyle';
// import Themes from './themes/Themes';
import { AuthProvider } from './context/AuthContext';
import AuthComponent from './components/Login/AuthComponent';

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

const theme = {
	global: {
		colors: {
			'light-2': '#f5f5f5',
			text: {
				light: 'rgba(0, 0, 0, 0.87)',
			},
		},
		edgeSize: {
			small: '14px',
		},
		elevation: {
			light: {
				medium:
					'0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
			},
		},
		font: {
			family: 'Roboto',
			size: '14px',
			height: '20px',
		},
	},
};

const App = function () {
	return (
		<Grommet theme={theme}>
			<AuthProvider>
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
			</AuthProvider>
		</Grommet>
	);
};

export default App;
