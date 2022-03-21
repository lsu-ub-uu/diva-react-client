import { render, screen } from '@testing-library/react';
import React from 'react';
import { Organisation, PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import PersonDomainPartView from './PersonDomainPartView';
import ListWithLabel from './ListWithLabel';
import getDomainCollection from '../../divaData/collections';
import AffiliationDisplay from './AffiliationDisplay';
import useApi from '../../hooks/useApi';
import createOrganisationWithNameAndId from '../../../testData/organisationObjectData';

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

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

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

const defaultPersonDomainPartWithAffiliation: PersonDomainPart = {
	id: 'somePDPId',
	recordType: 'personDomainPart',
	domain: 'uu',
	affiliations: [{ id: 'someId' }],
};

const personDomainPartWithMultipleAffiliations: PersonDomainPart = {
	id: 'somePDPId',
	recordType: 'personDomainPart',
	domain: 'uu',
	affiliations: [{ id: 'someId' }, { id: 'someId2' }, { id: 'someId3' }],
};

beforeAll(() => {
	const someDomainCollection = new Map();
	someDomainCollection.set('someDomainId', 'Some university');
	someDomainCollection.set('someOtherDomainId', 'Some other university');
	mockGetDomainCollection.mockReturnValue(someDomainCollection);

	const someOrganisation: Organisation = createOrganisationWithNameAndId(
		'someOrganisation',
		'someId'
	);
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: someOrganisation },
		isLoading: false,
		setApiParams: jest.fn(),
	});
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

	describe('Affiliations', () => {
		it('Renders AffiliationDisplay for each affiliation', () => {
			render(
				<PersonDomainPartView
					personDomainPart={defaultPersonDomainPartWithAffiliation}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenCalledTimes(1);

			render(
				<PersonDomainPartView
					personDomainPart={personDomainPartWithMultipleAffiliations}
				/>
			);
			expect(AffiliationDisplay).toHaveBeenCalledTimes(4);
		});

		it('passes organisation name to AffiliationDisplay', () => {
			const someOrganisation: Organisation = createOrganisationWithNameAndId(
				'someOrganisation',
				'someId'
			);
			mockUseApiReturnValueWithData(someOrganisation);

			render(
				<PersonDomainPartView
					personDomainPart={defaultPersonDomainPartWithAffiliation}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					affiliation: {
						name: 'someOrganisation',
					},
				}),
				expect.any(Object)
			);

			const someOtherOrganisation: Organisation =
				createOrganisationWithNameAndId('someOtherOrganisation', 'someId');
			mockUseApiReturnValueWithData(someOtherOrganisation);

			render(
				<PersonDomainPartView
					personDomainPart={defaultPersonDomainPartWithAffiliation}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					affiliation: {
						name: 'someOtherOrganisation',
					},
				}),
				expect.any(Object)
			);
		});

		it('passes fromYear to AffiliationDisplay', () => {
			const personDomainPart: PersonDomainPart = {
				id: 'somePDPId',
				recordType: 'personDomainPart',
				domain: 'uu',
				affiliations: [{ id: 'someId', fromYear: '1999' }],
			};
			render(<PersonDomainPartView personDomainPart={personDomainPart} />);

			expect(AffiliationDisplay).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					affiliation: {
						name: expect.any(String),
						fromYear: '1999',
					},
				}),
				expect.any(Object)
			);

			const otherPersonDomainPart: PersonDomainPart = {
				id: 'somePDPId',
				recordType: 'personDomainPart',
				domain: 'uu',
				affiliations: [{ id: 'someId', fromYear: '3000' }],
			};
			render(<PersonDomainPartView personDomainPart={otherPersonDomainPart} />);

			expect(AffiliationDisplay).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					affiliation: {
						name: expect.any(String),
						fromYear: '3000',
					},
				}),
				expect.any(Object)
			);
		});

		it('passes untilYear to AffiliationDisplay', () => {
			const personDomainPart: PersonDomainPart = {
				id: 'somePDPId',
				recordType: 'personDomainPart',
				domain: 'uu',
				affiliations: [{ id: 'someId', untilYear: '1999' }],
			};
			render(<PersonDomainPartView personDomainPart={personDomainPart} />);

			expect(AffiliationDisplay).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					affiliation: {
						name: expect.any(String),
						untilYear: '1999',
					},
				}),
				expect.any(Object)
			);

			const otherPersonDomainPart: PersonDomainPart = {
				id: 'somePDPId',
				recordType: 'personDomainPart',
				domain: 'uu',
				affiliations: [{ id: 'someId', untilYear: '3000' }],
			};
			render(<PersonDomainPartView personDomainPart={otherPersonDomainPart} />);

			expect(AffiliationDisplay).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					affiliation: {
						name: expect.any(String),
						untilYear: '3000',
					},
				}),
				expect.any(Object)
			);
		});
	});

	describe('Affiliation structure', () => {
		it('renders listitem for each affiliation', () => {
			const { rerender } = render(
				<PersonDomainPartView
					personDomainPart={defaultPersonDomainPartWithAffiliation}
				/>
			);

			expect(screen.getAllByRole('listitem')).toHaveLength(1);

			rerender(
				<PersonDomainPartView
					personDomainPart={personDomainPartWithMultipleAffiliations}
				/>
			);
			expect(screen.getAllByRole('listitem')).toHaveLength(3);
		});

		it('renders list if theres an affiliation', () => {
			render(
				<PersonDomainPartView
					personDomainPart={defaultPersonDomainPartWithAffiliation}
				/>
			);

			expect(screen.getAllByRole('list')).toHaveLength(1);
		});

		it('does not render list or list items if there is no affiliation', () => {
			render(<PersonDomainPartView personDomainPart={somePersonDomainPart} />);

			expect(screen.queryAllByRole('list')).toHaveLength(0);
			expect(screen.queryAllByRole('listitem')).toHaveLength(0);
		});
	});

	const mockUseApiReturnValueWithData = (data: any) => {
		mockUseApi.mockReturnValueOnce({
			result: { hasData: true, isError: false, data },
			isLoading: false,
			setApiParams: jest.fn(),
		});
	};
});

function expectHeadingWithText(name: string) {
	expect(screen.getByRole('heading', { name })).toBeInTheDocument();
}
