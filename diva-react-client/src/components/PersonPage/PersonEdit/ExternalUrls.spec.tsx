import React from 'react';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import ExternalUrls from './ExternalUrls';

const ComponentToTest = ExternalUrls;

const mockDispatchPerson = jest.fn();

describe('External Urls Component', () => {
	it('renders external urls with link titles', () => {
		const externalUrls = {
			content: {
				linkTitle: 'DN',
				URL: 'http://www.dn.se',
			},
			repeatId: 0,
		};

		render(
			<ComponentToTest
				externalURLs={[externalUrls]}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		const externalLinkTitle = screen.getByTestId(
			'externalURLs[0].linkTitle'
		);
		const externalURLS = screen.getByTestId('externalURLs[0].URL');
		expect(externalURLS).toHaveValue('http://www.dn.se');
		expect(externalLinkTitle).toHaveValue('DN');
	});

	it('add external url', () => {
		const externalUrls1 = {
			content: {
				linkTitle: 'DN',
				URL: 'http://www.dn.se',
			},
			repeatId: 0,
		};

		render(
			<ComponentToTest
				externalURLs={[externalUrls1]}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		userEvent.click(screen.getByTestId('Lägg till extern URL'));
		expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});

	it('change linkTitle and URL', () => {
		const externalUrls1 = {
			content: {
				linkTitle: 'DN',
				URL: 'http://www.dn.se',
			},
			repeatId: 0,
		};

		render(
			<ComponentToTest
				externalURLs={[externalUrls1]}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		userEvent.type(inputFields[1], 'a');
		expect(mockDispatchPerson).toHaveBeenCalledTimes(2);
	});

	it('trash button', () => {
		const externalUrls1 = {
			content: {
				linkTitle: 'DN',
				URL: 'http://www.dn.se',
			},
			repeatId: 0,
		};

		render(
			<ComponentToTest
				externalURLs={[externalUrls1]}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		userEvent.click(screen.getByTestId('trashbutton'));
		expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});
});
