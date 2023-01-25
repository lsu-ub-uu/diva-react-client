import React from 'react';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import StringArray from '../StringArray';
import { FormPerson } from '../../../../types/FormPerson';

const dispatchPerson = jest.fn();
describe('String array field component', () => {
	it('renders string array', () => {
		const arr: string[] = ['foo', 'bar'];

		render(
			<StringArray
				field={'foobar' as keyof FormPerson}
				label='foo'
				stringArray={arr}
				dispatchPerson={dispatchPerson}
			/>
		);

		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		userEvent.type(inputFields[1], 'a');
		userEvent.click(screen.getAllByTestId('trashbutton')[0]);

		userEvent.click(screen.getByTestId('Lägg till foo'));
		expect(dispatchPerson).toHaveBeenCalledTimes(4);
	});
});
