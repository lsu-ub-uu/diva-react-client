/* eslint-disable import/no-extraneous-dependencies */
import { render } from '@testing-library/react';
import { Grommet } from 'grommet';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: any, { route = '/' } = {}) => {
	window.history.pushState({}, 'Test page', route);

	return render(ui, { wrapper: BrowserRouter });
};

export const renderWithGrommet = (ui: any) => {
	return render(ui, { wrapper: Grommet });
};

export * from '@testing-library/react';
