import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Grommet, ThemeType } from 'grommet';
import Layout from './components/Layout/Layout';
import Main from './components/Layout/Main';
import Sidebar from './components/Layout/Sidebar';
import NoMatch from './components/NoMatch';
import PersonRoot from './components/PersonRoot';
import PersonSearch from './components/PersonSearch';
import PersonPage from './components/PersonPage';
import { AuthProvider } from './context/AuthContext';
import AuthComponent from './components/Login/AuthComponent';

const theme: ThemeType = {
	global: {
		font: {
			family:
				'-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue',
		},
		colors: {
			brand: '#3183c8',
			'accent-1': '#3183c8',
			'accent-2': '#3183c8',
			'accent-3': '#3183c8',
			'accent-4': '#3183c8',
		},
		focus: {
			border: {
				color: '#a8eeeb',
			},
		},
	},
	button: {
		border: {
			radius: 'none',
		},
	},
	tag: {
		round: 'none',
	},
	nameValueList: {
		gap: {
			column: 'small',
			row: 'small',
		},
	},
};

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
								<Route path="edit">
									<Route path=":personId" element={<PersonPage edit />} />
								</Route>
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
