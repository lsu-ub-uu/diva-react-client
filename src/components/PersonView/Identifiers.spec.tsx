// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import React from 'react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	personWithDomain,
} from '../../../testData/personData';
import ListWithLabel from './ListWithLabel';
import Identifiers from './Identifiers';

jest.mock('./ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('identifiers', () => {
	it('should take a person', () => {
		render(<Identifiers person={createMinimumPersonWithIdAndName()} />);
	});

	it('should call ListWithLabel with id', () => {
		const { rerender } = render(<Identifiers person={personWithDomain} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(1);
		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				label: 'pID',
				list: [personWithDomain.id],
			}),
			expect.any(Object)
		);
		const otherPerson = createMinimumPersonWithIdAndName('someId');
		rerender(<Identifiers person={otherPerson} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				label: 'pID',
				list: [otherPerson.id],
			}),
			expect.any(Object)
		);
	});
	it('should call ListWithLabel with ORCID and orcidIds if they exist on person', () => {
		const person = createCompletePerson();
		person.viafIDs = [];
		person.librisIDs = [];
		render(<Identifiers person={person} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				label: 'ORCID',
				list: person.orcidIDs,
			}),
			expect.any(Object)
		);
	});
	it('should call ListWithLabel with VIAF and viafIds if they exist on person', () => {
		const person = createCompletePerson();
		person.orcidIDs = [];
		person.librisIDs = [];
		render(<Identifiers person={person} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				label: 'VIAF',
				list: person.viafIDs,
			}),
			expect.any(Object)
		);
	});
	it('should call ListWithLabel with Libris-id and librisIDs if they exist on person', () => {
		const person = createCompletePerson();
		person.orcidIDs = [];
		person.viafIDs = [];
		render(<Identifiers person={person} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				label: 'Libris-id',
				list: person.librisIDs,
			}),
			expect.any(Object)
		);
	});
	it('should not call ListWithLabel for ORCID if person has no ORCIDs, VIAFs or Libris ids', () => {
		render(<Identifiers person={personWithDomain} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(1);
	});
});
