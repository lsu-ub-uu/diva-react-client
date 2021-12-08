import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { PersonSearch } from '../../src/components/PersonSearch';
import { searchPersonsByNameSearch } from '../../src/control/api';
import Person from '../../src/control/Person';
import Name from '../../src/control/Name';

jest.mock('../../src/control/api');
jest.mock('../../src/components/PersonList');

const mockSearchPersonsByNameSearch =
	searchPersonsByNameSearch as jest.MockedFunction<
		typeof searchPersonsByNameSearch
	>;

const mockPersonList = jest.fn();
const personList = PersonList as jest.MockedFunction<typeof PersonList>;

const personWithDomain: Person = new Person('2', new Name('Enequist', 'Gerd'));
personWithDomain.setDomains(['Uppsala Universitet', 'Test']);

const threePersonObjects: Person[] = [
	new Person('1', new Name('Anka', 'Kalle')),
	personWithDomain,
	new Person('3', new Name('Ernman', 'Malena')),
];

beforeEach(() => {
	jest.clearAllTimers();
	jest.clearAllMocks();

	personList.mockImplementation((props: any) => {
		mockPersonList(props);
		return <div />;
	});
});

describe('The PersonSearch component', () => {
	it('Shows an h1 with content "Personsök"', () => {
		render(<PersonSearch />);

		const heading = screen.getByRole('heading');
		expect(heading.textContent).toEqual('Personsök');
	});

	it('Renders an input field of type text', () => {
		render(<PersonSearch />);

		const textInputs = screen.queryAllByRole('textbox');
		expect(textInputs).toHaveLength(1);
	});

	it('Renders a button with text "Sök"', () => {
		render(<PersonSearch />);

		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0]).toHaveTextContent('Sök');
		expect(buttons[0]).toHaveAttribute('type', 'submit');
	});

	it('Renders passes empty person array to PersonList on start.', () => {
		render(<PersonSearch />);

		expect(mockPersonList).toHaveBeenCalledTimes(1);
		expect(mockPersonList).toHaveBeenCalledWith(
			expect.objectContaining({
				persons: [],
			})
		);
	});

	it('Renders several results returned by searchPersonsByNameSearch when clicking the submit button', async () => {
		mockSearchPersonsByNameSearch.mockResolvedValue(threePersonObjects);
		render(<PersonSearch />);

		expect(mockPersonList).toHaveBeenCalledTimes(1);
		expect(mockPersonList).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				persons: [],
			})
		);
		const inputText = screen.getByRole('textbox');
		userEvent.type(inputText, 'someSearchTerm');

		jest.clearAllTimers();
		jest.clearAllMocks();
		mockSearchPersonsByNameSearch.mockResolvedValue(threePersonObjects);

		const button = screen.getByRole('button');
		userEvent.click(button);

		await waitFor(() => {
			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
		});

		expect(mockPersonList).toHaveBeenCalledTimes(1);
		expect(mockPersonList).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				persons: threePersonObjects,
			})
		);
	});

	it('Does not pass an empty searchTerm to searchPersonsByNameSearch when button is clicked', async () => {
		mockSearchPersonsByNameSearch.mockResolvedValue(threePersonObjects);
		render(<PersonSearch />);

		const button = screen.getByRole('button');
		userEvent.click(button);

		await waitFor(() => {
			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(0);
		});

		const inputText = screen.getByRole('textbox');
		userEvent.clear(inputText);
		userEvent.type(inputText, 'someSearchTerm');

		userEvent.click(button);

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');
	});

	it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch when button is clicked', async () => {
		mockSearchPersonsByNameSearch.mockResolvedValue(threePersonObjects);
		render(<PersonSearch />);

		const inputText = screen.getByRole('textbox');
		userEvent.type(inputText, 'someSearchTerm');

		const button = screen.getByRole('button');
		userEvent.click(button);

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');

		userEvent.clear(inputText);
		userEvent.type(inputText, 'someOtherSearchTerm');

		userEvent.click(button);

		await assertSearchIsCalledTimesWith(2, 'someOtherSearchTerm');
	});

	it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch when enter is clicked', async () => {
		render(<PersonSearch />);
		mockSearchPersonsByNameSearch.mockResolvedValue(threePersonObjects);

		const listItemsBeforeClick = screen.queryAllByRole('listitem');
		expect(listItemsBeforeClick).toHaveLength(0);

		const inputText = screen.getByRole('textbox');
		userEvent.type(inputText, 'someSearchTerm');

		userEvent.type(inputText, '{enter}');

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');
	});
});

async function assertSearchIsCalledTimesWith(
	times: number,
	searchTerm: string
) {
	return waitFor(() => {
		expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(times);
		expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(searchTerm);
	});
}
