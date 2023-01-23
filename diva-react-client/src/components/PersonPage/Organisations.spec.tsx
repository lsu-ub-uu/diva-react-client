import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';
import Organisations from './Organisations';
import FormPersonDomainPartView from './FormPersonDomainPartView';

const defaultPersonDomainParts: FormPersonDomainPart[] = [];
const organisations = new Map<string, string>();

jest.mock('./FormPersonDomainPartView', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('Organisations', () => {
	it('takes personDomainPartIds, personDomainparts and organisations', () => {
		render(
			<Organisations
				personDomainPartIds={['someId', 'someOtherId']}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);
	});

	it('If personDomainPartIds is empty, does not render a heading', () => {
		render(
			<Organisations
				personDomainPartIds={[]}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);

		const heading = screen.queryByRole('heading', {
			name: 'Organisationer',
		});

		expect(heading).not.toBeInTheDocument();
	});

	it('If personDomainPartIds is NOT empty, DOES render a heading', () => {
		render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);

		const heading = screen.queryByRole('heading', {
			name: 'Organisationer',
		});

		expect(heading).toBeInTheDocument();
	});

	it('If personDomainPartIds is empty, does not render a list', () => {
		render(
			<Organisations
				personDomainPartIds={[]}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);

		const list = screen.queryByRole('list');

		expect(list).not.toBeInTheDocument();
	});

	it('If personDomainPartIds is NOT empty, DOES render a list', () => {
		render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);

		expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
	});

	it('Loops over personDomainPartIds', () => {
		const { rerender } = render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);

		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);

		rerender(
			<Organisations
				personDomainPartIds={['someId', 'someId2', 'someId3']}
				organisations={organisations}
				personDomainParts={defaultPersonDomainParts}
			/>
		);
		expect(
			screen.getAllByText((content, element) =>
				content.startsWith('Kunde inte')
			)
		).toHaveLength(3);
	});

	it('Displays "Kunde inte hitta information för persondomainpart: $ID" if personDomainParts does not include a personDomainPart with that id', () => {
		const emptyPersonDomainParts: FormPersonDomainPart[] = [];
		const { rerender } = render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={emptyPersonDomainParts}
			/>
		);

		expect(
			screen.getAllByText((content, element) =>
				content.startsWith(
					'Kunde inte hitta information för PersonDomainPart "someId"'
				)
			)
		).toHaveLength(1);

		rerender(
			<Organisations
				personDomainPartIds={['someId', 'someOtherId', 'someThirdId']}
				organisations={organisations}
				personDomainParts={emptyPersonDomainParts}
			/>
		);

		expect(
			screen.getAllByText((content, element) =>
				content.startsWith(
					'Kunde inte hitta information för PersonDomainPart'
				)
			)
		).toHaveLength(3);
	});

	it('Does not display "Kunde inte hitta information för persondomainpart: $ID" if personDomainParts DOES include a personDomainPart with that id', () => {
		const nonEmptyPersonDomainParts: FormPersonDomainPart[] = [
			{
				id: 'someId',
				domain: 'uu',
				identifiers: [],
				affiliations: [],
			},
		];
		render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={nonEmptyPersonDomainParts}
			/>
		);
		expect(() =>
			screen.getByText(
				'Kunde inte hitta information för PersonDomainPart "someId"'
			)
		).toThrow();
	});

	it('calls FormPersonDomainPartView with PersonDomainPart from list if it exists', () => {
		const personDomainParts: FormPersonDomainPart[] = [
			{
				id: 'someId',
				domain: 'uu',
				identifiers: [],
				affiliations: [],
			},
		];
		const { rerender } = render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={personDomainParts}
			/>
		);

		expect(FormPersonDomainPartView).toHaveBeenCalledTimes(1);
		expect(FormPersonDomainPartView).toHaveBeenLastCalledWith(
			expect.objectContaining({
				organisations,
				personDomainPart: {
					id: 'someId',
					domain: 'uu',
					identifiers: [],
					affiliations: [],
				},
			}),
			expect.any(Object)
		);

		personDomainParts.push({
			id: 'someOtherId',
			domain: 'kth',
			identifiers: [],
			affiliations: [],
		});

		rerender(
			<Organisations
				personDomainPartIds={['someId', 'someOtherId']}
				organisations={organisations}
				personDomainParts={personDomainParts}
			/>
		);

		expect(FormPersonDomainPartView).toHaveBeenCalledTimes(3);
		expect(FormPersonDomainPartView).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				organisations,
				personDomainPart: {
					id: 'someId',
					domain: 'uu',
					identifiers: [],
					affiliations: [],
				},
			}),
			expect.any(Object)
		);
		expect(FormPersonDomainPartView).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({
				organisations,
				personDomainPart: {
					id: 'someOtherId',
					domain: 'kth',
					identifiers: [],
					affiliations: [],
				},
			}),
			expect.any(Object)
		);
	});
});
