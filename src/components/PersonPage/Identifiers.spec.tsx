// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import React from 'react';
import {
	createCompletePerson,
	createMinimumPersonWithIdAndName,
	createPersonObject,
	personWithDomain,
} from '../../../testData/personObjectData';
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
	it('should call ListWithLabel with ORCID, omitEmptyStrings and orcids if they exist on person', () => {
		const person = createCompletePerson();
		person.viafIDs = [];
		person.librisIDs = [];
		render(<Identifiers person={person} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				label: 'ORCID',
				list: person.orcids,
				omitEmptyStrings: true,
			}),
			expect.any(Object)
		);
	});
	it('should call ListWithLabel with VIAF and viafIds if they exist on person', () => {
		const person = createCompletePerson();
		person.orcids = [];
		person.librisIDs = [];
		render(<Identifiers person={person} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				label: 'VIAF',
				list: person.viafIDs,
				omitEmptyStrings: true,
			}),
			expect.any(Object)
		);
	});
	it('should call ListWithLabel with Libris-id and librisIDs if they exist on person', () => {
		const person = createCompletePerson();
		person.orcids = [];
		person.viafIDs = [];
		render(<Identifiers person={person} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
		expect(ListWithLabel).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				label: 'Libris-id',
				list: person.librisIDs,
				omitEmptyStrings: true,
			}),
			expect.any(Object)
		);
	});
	it('should not call ListWithLabel if person has no ORCIDs, VIAFs or Libris ids', () => {
		render(<Identifiers person={personWithDomain} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(1);

		const personWithEmptyIdentifiers = createPersonObject(
			'someId',
			'someName',
			'someFirstName'
		);

		personWithEmptyIdentifiers.orcids = [];
		personWithEmptyIdentifiers.viafIDs = [];
		personWithEmptyIdentifiers.librisIDs = [];

		render(<Identifiers person={personWithEmptyIdentifiers} />);
		expect(ListWithLabel).toHaveBeenCalledTimes(2);
	});
});
