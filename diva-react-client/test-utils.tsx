/* eslint-disable import/no-extraneous-dependencies */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: any, { route = '/' } = {}) => {
	window.history.pushState({}, 'Test page', route);

	return render(ui, { wrapper: BrowserRouter });
};

export * from '@testing-library/react';
