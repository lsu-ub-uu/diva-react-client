import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextInput } from 'grommet';
import MemoizedTextField from './MemoizedFormField';

describe('Memoized', () => {
	it('renders', () => {
		render(<MemoizedTextField label="someLabel" value="someValue" />);

		screen.debug();
	});
});
