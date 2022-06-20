import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoizedTextField, MemoizedTextArea } from './MemoizedFormField';

describe('Memoized form field', () => {
	it('renders MemoizedTextField', () => {
		render(<MemoizedTextField label="someLabel" value="someValue" />);
		expect(screen.getByRole('textbox')).toHaveValue('someValue');
	});

	it('renders MemoizedTextArea', () => {
		render(<MemoizedTextArea label="someLabel" value="someValue" />);
		expect(screen.getByRole('textbox')).toHaveValue('someValue');
	});
});
