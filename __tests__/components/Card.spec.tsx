import { render, screen } from '@testing-library/react';
import React from 'react';
import Card from '../../src/components/Card';

describe('The PersonCard component', () => {
	it('Renders a section and takes text and id', () => {
		render(<Card text="some text" id="1" />);
		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(listItems[0]).toHaveTextContent('some text');
		expect(listItems[0]).toHaveTextContent('1');
	});

	it('Renders text as link', () => {
		render(<Card text="some text" id="1" />);
		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(1);
		expect(links[0].textContent).toStrictEqual('some text');
		expect(links[0]).toHaveClass('headingLink');
	});
});
