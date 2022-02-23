import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const app = document.getElementById('root');
ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.BASENAME}>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
	app
);
