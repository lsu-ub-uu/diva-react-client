import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	Organisation,
	PersonDomainPart,
	RecordType,
} from 'diva-cora-ts-api-wrapper';
import PersonDomainPartView from './PersonDomainPartView';
import ListWithLabel from './ListWithLabel';
import getDomainCollection from '../../divaData/collections';
import AffiliationDisplay from './AffiliationDisplay';

jest.mock('../../divaData/collections');
const mockGetDomainCollection = getDomainCollection as jest.MockedFunction<
	typeof getDomainCollection
>;

jest.mock('./ListWithLabel', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('./AffiliationDisplay', () => {
	return jest.fn(() => {
		return <div />;
	});
});

let Child: (props: any) => JSX.Element;

const mockedRecordFetcher = jest.fn();
jest.mock('../RecordFetcher', () => {
	return function RFetcher(props: any) {
		mockedRecordFetcher(props);
		const { children } = props;
		Child = children;
		return null;
	};
});

const someBarePersonDomainPart: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
	domain: 'someDomainId',
};

const somePersonDomainPart: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
	identifiers: ['someIdentifier'],
	domain: 'someDomainId',
};

const someOtherPersonDomainPart: PersonDomainPart = {
	id: 'someOtherId',
	recordType: 'personDomainPart',
	identifiers: ['someOtherIdentifier'],
	domain: 'someOtherDomainId',
};

const somePersonDomainPartWithOrganisations: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
	affiliations: [
		{ id: 'someOrganisationId' },
		{ id: 'someOrganisationId2' },
		{ id: 'someOrganisationId3' },
	],
	domain: 'someId',
};

beforeAll(() => {
	const someDomainCollection = new Map();
	someDomainCollection.set('someDomainId', 'Some university');
	someDomainCollection.set('someOtherDomainId', 'Some other university');
	mockGetDomainCollection.mockReturnValue(someDomainCollection);
});

describe('PersonDomainPartView', () => {
	it('should take a personDomainPart', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);
	});

	it('should render domain name from getDomainCollection', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

		expect(getDomainCollection).toHaveBeenCalledTimes(1);
		expectHeadingWithText('Some university');

		render(
			<PersonDomainPartView personDomainPart={someOtherPersonDomainPart} />
		);

		expectHeadingWithText('Some other university');
	});

	it('should render "Domän: domainId" if domain ID not in domainCollection', () => {
		mockGetDomainCollection.mockReturnValueOnce(new Map());
		const { rerender } = render(
			<PersonDomainPartView personDomainPart={somePersonDomainPart} />
		);

		expect(getDomainCollection).toHaveBeenCalledTimes(1);
		expectHeadingWithText('DomänId: someDomainId');

		mockGetDomainCollection.mockReturnValueOnce(new Map());
		rerender(
			<PersonDomainPartView personDomainPart={someOtherPersonDomainPart} />
		);
		expectHeadingWithText('DomänId: someOtherDomainId');
	});

	it('should NOT call ListWithLabel with identifiers if identifiers undefined', () => {
		render(
			<PersonDomainPartView personDomainPart={someBarePersonDomainPart} />
		);

		expect(ListWithLabel).not.toHaveBeenCalled();
	});

	it('should call ListWithLabel with identifiers', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				list: somePersonDomainPart.identifiers,
				label: expect.any(String),
			}),
			expect.any(Object)
		);
		render(
			<PersonDomainPartView personDomainPart={someOtherPersonDomainPart} />
		);

		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				list: someOtherPersonDomainPart.identifiers,
				label: expect.any(String),
			}),
			expect.any(Object)
		);
	});

	it('should call ListWithLabel with identifiers', () => {
		render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

		expect(ListWithLabel).toHaveBeenCalledWith(
			expect.objectContaining({
				list: expect.any(Array),
				label: 'Lokal identifikator',
			}),
			expect.any(Object)
		);
	});

	describe('Organisations', () => {
		it('if there are no affiliations, should not call OrganisationFetcher', () => {
			render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);
			expect(mockedRecordFetcher).not.toHaveBeenCalled();
		});

		it('if there ARE affiliations, should call OrganisationFetcher for each organisation', () => {
			render(
				<PersonDomainPartView
					personDomainPart={somePersonDomainPartWithOrganisations}
				/>
			);
			expect(mockedRecordFetcher).toHaveBeenCalledTimes(3);
		});
		it('if there ARE affiliations, should call OrganisationFetcher with each organisationId', () => {
			render(
				<PersonDomainPartView
					personDomainPart={somePersonDomainPartWithOrganisations}
				/>
			);
			expect(mockedRecordFetcher).toHaveBeenCalledTimes(3);
			expect(mockedRecordFetcher).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					id: 'someOrganisationId',
					recordType: RecordType.Organisation,
					children: expect.any(Function),
				})
			);
			expect(mockedRecordFetcher).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					id: 'someOrganisationId2',
					recordType: RecordType.Organisation,
				})
			);
			expect(mockedRecordFetcher).toHaveBeenNthCalledWith(
				3,
				expect.objectContaining({
					id: 'someOrganisationId3',
					recordType: RecordType.Organisation,
				})
			);
		});
		it('should pass AffiliationDisplay as child to RecordFetcher', () => {
			const somePersonDomainPartWithOneAffiliation: PersonDomainPart = {
				id: 'someId',
				recordType: 'personDomainPart',
				affiliations: [{ id: 'someOrganisationId' }],
				domain: 'someId',
			};
			render(
				<PersonDomainPartView
					personDomainPart={somePersonDomainPartWithOneAffiliation}
				/>
			);

			const someOrganisation: Organisation = {
				name: 'someOrganisationName',
				id: 'someId',
				recordType: 'organisation',
				organisationType: 'toporganisation',
				alternativeName: '',
			};

			render(<Child record={someOrganisation} />);

			expect(AffiliationDisplay).toHaveBeenCalledWith(
				expect.objectContaining({
					affiliation: {
						name: 'someOrganisationName',
						fromYear: undefined,
						untilYear: undefined,
					},
				}),
				expect.any(Object)
			);

			const someOtherPersonDomainPartWithOneAffiliation: PersonDomainPart = {
				id: 'someId',
				recordType: 'personDomainPart',
				affiliations: [
					{ id: 'someOrganisationId', fromYear: '1999', untilYear: '2002' },
				],
				domain: 'someId',
			};
			render(
				<PersonDomainPartView
					personDomainPart={someOtherPersonDomainPartWithOneAffiliation}
				/>
			);

			const someOtherOrganisation: Organisation = {
				name: 'someOtherOrganisationName',
				id: 'someId',
				recordType: 'organisation',
				organisationType: 'toporganisation',
				alternativeName: '',
			};

			render(<Child record={someOtherOrganisation} />);

			expect(AffiliationDisplay).toHaveBeenCalledWith(
				expect.objectContaining({
					affiliation: {
						name: 'someOtherOrganisationName',
						fromYear: '1999',
						untilYear: '2002',
					},
				}),
				expect.any(Object)
			);
		});
	});
});

function expectHeadingWithText(name: string) {
	expect(screen.getByRole('heading', { name })).toBeInTheDocument();
}
