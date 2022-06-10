import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';
import Organisations from './Organisations';

const personDomainParts: FormPersonDomainPart[] = [];
const organisations = new Map<string, string>();

describe('Organisations', () => {
	it('takes personDomainPartIds, personDomainparts and organisations', () => {
		render(
			<Organisations
				personDomainPartIds={['someId', 'someOtherId']}
				organisations={organisations}
				personDomainParts={personDomainParts}
			/>
		);
	});

	it('If personDomainPartIds is empty, does not render a list', () => {
		render(
			<Organisations
				personDomainPartIds={[]}
				organisations={organisations}
				personDomainParts={personDomainParts}
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
				personDomainParts={personDomainParts}
			/>
		);

		expect(screen.getByRole('list')).toBeInTheDocument();
	});

	it('Loops over personDomainPartIds', () => {
		const { rerender } = render(
			<Organisations
				personDomainPartIds={['someId']}
				organisations={organisations}
				personDomainParts={personDomainParts}
			/>
		);

		expect(screen.getAllByRole('listitem')).toHaveLength(1);

		rerender(
			<Organisations
				personDomainPartIds={['someId', 'someId2', 'someId3']}
				organisations={organisations}
				personDomainParts={personDomainParts}
			/>
		);
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});
});
