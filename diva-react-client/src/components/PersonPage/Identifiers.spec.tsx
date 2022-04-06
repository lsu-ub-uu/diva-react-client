import React from 'react';
import { screen } from '@testing-library/react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personObjectData';
import Identifiers from './Identifiers';
import { renderWithGrommet } from '../../../test-utils';

jest.mock('./ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('identifiers', () => {
	it('should take a person', () => {
		renderWithGrommet(
			<Identifiers person={createMinimumPersonWithIdAndName()} />
		);
	});

	it('should render "pID" and id', () => {
		const { rerender } = renderWithGrommet(
			<Identifiers person={personWithDomain} />
		);
		expect(screen.getByText('pID')).toBeInTheDocument();
		expect(screen.getByText(personWithDomain.id)).toBeInTheDocument();

		const otherPerson = createMinimumPersonWithIdAndName('someId');
		rerender(<Identifiers person={otherPerson} />);
		expect(screen.getByText('pID')).toBeInTheDocument();
		expect(screen.getByText(otherPerson.id)).toBeInTheDocument();
	});
	it('For each non-empty ORCID, should display "ORCID" and the orcid', () => {
		const person = createCompletePerson();
		person.viafIDs = [];
		person.librisIDs = [];
		const { rerender } = renderWithGrommet(<Identifiers person={person} />);

		expect(screen.getAllByText('ORCID')).toHaveLength(2);
		person.orcids?.forEach((id) => {
			expect(screen.getByText(id)).toBeInTheDocument();
		});

		const personWithoutOrcids = createMinimumPersonWithIdAndName();
		rerender(<Identifiers person={personWithoutOrcids} />);
		expect(screen.queryAllByText('ORCID')).toHaveLength(0);

		const personWithOneEmptyOrcid = createMinimumPersonWithIdAndName();
		personWithOneEmptyOrcid.orcids = ['someOrcid', ''];
		rerender(<Identifiers person={personWithOneEmptyOrcid} />);
		expect(screen.queryAllByText('ORCID')).toHaveLength(1);
		expect(screen.getByText('someOrcid')).toBeInTheDocument();
	});
	it('For each non-empty VIAF, should display "VIAF" and the viaf-id', () => {
		const person = createCompletePerson();
		person.orcids = [];
		person.librisIDs = [];
		const { rerender } = renderWithGrommet(<Identifiers person={person} />);

		expect(screen.getAllByText('VIAF')).toHaveLength(2);
		person.viafIDs?.forEach((id) => {
			expect(screen.getByText(id)).toBeInTheDocument();
		});

		const personWithoutViafs = createMinimumPersonWithIdAndName();
		rerender(<Identifiers person={personWithoutViafs} />);
		expect(screen.queryAllByText('VIAF')).toHaveLength(0);

		const personWithOneEmptyViaf = createMinimumPersonWithIdAndName();
		personWithOneEmptyViaf.viafIDs = ['someViaf', ''];
		rerender(<Identifiers person={personWithOneEmptyViaf} />);
		expect(screen.queryAllByText('VIAF')).toHaveLength(1);
		expect(screen.getByText('someViaf')).toBeInTheDocument();
	});
	it('should call ListWithLabel with Libris-id and librisIDs if they exist on person', () => {
		const person = createCompletePerson();
		person.orcids = [];
		person.viafIDs = [];
		const { rerender } = renderWithGrommet(<Identifiers person={person} />);

		expect(screen.getAllByText('Libris-id')).toHaveLength(2);
		person.librisIDs?.forEach((id) => {
			expect(screen.getByText(id)).toBeInTheDocument();
		});

		const personWithoutViafs = createMinimumPersonWithIdAndName();
		rerender(<Identifiers person={personWithoutViafs} />);
		expect(screen.queryAllByText('Libris-id')).toHaveLength(0);

		const personWithOneEmptyViaf = createMinimumPersonWithIdAndName();
		personWithOneEmptyViaf.librisIDs = ['someLibris', ''];
		rerender(<Identifiers person={personWithOneEmptyViaf} />);
		expect(screen.queryAllByText('Libris-id')).toHaveLength(1);
		expect(screen.getByText('someLibris')).toBeInTheDocument();
	});
});
