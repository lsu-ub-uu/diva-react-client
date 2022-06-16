import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StringFormField from './StringFormField';
import { FormPerson } from '../../../types/FormPerson';

const mockOnChange = jest.fn();
describe('String form field component', () => {
	it('renders string form field and changes value', () => {
		const field1 keyof FormPerson;

		render(
			<StringFormField
				onChange={mockOnChange}
				label="foo"
				value="bar"
				field="{field1}"
			/>
		);
		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(inputFields[0]).toHaveAttribute('value', 'bar');
	});
});
