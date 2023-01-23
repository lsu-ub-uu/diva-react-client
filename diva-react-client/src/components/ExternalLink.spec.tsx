import React from 'react';
import { render, screen } from '@testing-library/react';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
	it('takes a URL and a Link text', () => {
		render(
			<ExternalLink
				URL='someUrl'
				text='someText'
			/>
		);
	});
	it('Renders link with linkText', () => {
		const { rerender } = render(
			<ExternalLink
				URL='someUrl'
				text='someText'
			/>
		);

		const link = screen.getByRole('link');

		expect(link).toBeInTheDocument();

		expect(link).toHaveTextContent('someText');

		rerender(
			<ExternalLink
				URL='someUrl'
				text='someOtherText'
			/>
		);

		expect(screen.getByRole('link')).toHaveTextContent('someOtherText');
	});

	it('Renders link with href=URL', () => {
		const { rerender } = render(
			<ExternalLink
				URL='someUrl'
				text='someText'
			/>
		);

		expect(screen.getByRole('link')).toHaveAttribute('href', 'someUrl');

		rerender(
			<ExternalLink
				URL='someOtherUrl'
				text='someOtherText'
			/>
		);

		expect(screen.getByRole('link')).toHaveAttribute(
			'href',
			'someOtherUrl'
		);
	});
});
