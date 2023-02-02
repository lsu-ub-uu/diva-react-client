import React from 'react';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// const app = document.getElementById('root');

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.BASENAME}>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
