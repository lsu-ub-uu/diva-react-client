import { render, screen } from '@testing-library/react';
import React from 'react';
import NoMatch from '../../src/components/NoMatch';

describe('The NoMatch component', () => {
	it('Displays a paragraph that tells the user nothing is there', () => {
		render(<NoMatch />);
		expect(screen.getByText("There's nothing here: 404!")).toBeInTheDocument();
	});
});
