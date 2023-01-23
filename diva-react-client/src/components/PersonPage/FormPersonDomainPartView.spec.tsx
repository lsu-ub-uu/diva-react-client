import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from 'grommet';
import FormPersonDomainPartView from './FormPersonDomainPartView';
import {
	completeFormPersonDomainpart,
	minimalFormPersonDomainPart,
} from '../../../testData/personDomainPartObjectData';
import getDomainCollection from '../../divaData/resources';
import { FormPersonDomainPart } from '../../types/FormPersonDomainPart';
import AffiliationDisplay from './AffiliationDisplay';

const organisations = new Map<string, string>();
organisations.set('someId', 'someOrganisations');

jest.mock('../../divaData/resources');
const mockGetDomainCollection = getDomainCollection as jest.MockedFunction<
	typeof getDomainCollection
>;

jest.mock('grommet', () => ({
	...jest.requireActual('grommet'),
	Text: jest.fn((props: any) => {
		const { children } = props;
		return <p>{children}</p>;
	}),
}));

jest.mock('./AffiliationDisplay', () => {
	return jest.fn(() => {
		return <div />;
	});
});

beforeAll(() => {
	const someDomainCollection = new Map();
	someDomainCollection.set('someDomainId', 'Some university');
	someDomainCollection.set('someOtherDomainId', 'Some other university');
	mockGetDomainCollection.mockReturnValue(someDomainCollection);
});

const defaultFormPersonDomainPartWithAffiliation: FormPersonDomainPart = {
	id: 'somePDPId',
	domain: 'uu',
	affiliations: [{ id: 'someId', fromYear: '1990', untilYear: '2000' }],
	identifiers: [],
};

const formPersonDomainPartWithMultipleAffiliations: FormPersonDomainPart = {
	id: 'somePDPId',
	domain: 'uu',
	affiliations: [
		{ id: 'someId', fromYear: '1930', untilYear: '1950' },
		{ id: 'someId2', fromYear: '', untilYear: '2002' },
		{ id: 'someId3', fromYear: '2010', untilYear: '' },
		{ id: 'someId4', fromYear: '', untilYear: '' },
	],
	identifiers: [],
};

describe('FormPersonDomainPartView.spec', () => {
	it('Takes personDomainPart and organisations', () => {
		render(
			<FormPersonDomainPartView
				personDomainPart={completeFormPersonDomainpart}
				organisations={organisations}
			/>
		);
	});

	it('should render domain name from getDomainCollection', () => {
		const formPersonDomainPart = {
			id: 'someCompleteId',
			identifiers: ['someIdentifier'],
			domain: 'someDomainId',
			affiliations: [
				{
					id: 'someAffiliationid',
					fromYear: '1990',
					untilYear: '2000',
				},
			],
		};
		render(
			<FormPersonDomainPartView
				personDomainPart={formPersonDomainPart}
				organisations={organisations}
			/>
		);
		expect(getDomainCollection).toHaveBeenCalledTimes(1);
		expectHeadingWithText('Some university');

		const otherFormPersonDomainPart = {
			id: 'someOtherCompleteId',
			identifiers: ['someOtherIdentifier'],
			domain: 'someOtherDomainId',
			affiliations: [
				{
					id: 'someOtherAffiliationid',
					fromYear: '1990',
					untilYear: '2000',
				},
			],
		};

		render(
			<FormPersonDomainPartView
				personDomainPart={otherFormPersonDomainPart}
				organisations={organisations}
			/>
		);
		expectHeadingWithText('Some other university');
	});

	it('should render "Domän: domainId" if domain ID not in domainCollection', () => {
		mockGetDomainCollection.mockReturnValueOnce(new Map());
		const { rerender } = render(
			<FormPersonDomainPartView
				personDomainPart={completeFormPersonDomainpart}
				organisations={organisations}
			/>
		);

		expect(getDomainCollection).toHaveBeenCalledTimes(1);
		expectHeadingWithText('DomänId: kth');

		mockGetDomainCollection.mockReturnValueOnce(new Map());

		rerender(
			<FormPersonDomainPartView
				personDomainPart={minimalFormPersonDomainPart}
				organisations={organisations}
			/>
		);
		expectHeadingWithText('DomänId: uu');
	});

	it('should NOT call Tag with first identifier, if identifiers is empty', () => {
		render(
			<FormPersonDomainPartView
				personDomainPart={minimalFormPersonDomainPart}
				organisations={organisations}
			/>
		);
		expect(Text).not.toHaveBeenCalled();
	});

	it('should call Tag with label and first identifier', () => {
		const personDomainPart = {
			id: 'someMinimalId',
			identifiers: ['someIdentifier'],
			domain: 'uu',
			affiliations: [],
		};
		render(
			<FormPersonDomainPartView
				personDomainPart={personDomainPart}
				organisations={organisations}
			/>
		);

		expect(Text).toHaveBeenCalledWith(
			expect.objectContaining({
				size: 'small',
				children: ['Lokal identifikator: ', 'someIdentifier'],
			}),
			expect.any(Object)
		);

		const otherPersonDomainPart = {
			id: 'someMinimalId',
			identifiers: ['someOtherIdentifier'],
			domain: 'uu',
			affiliations: [],
		};

		render(
			<FormPersonDomainPartView
				personDomainPart={otherPersonDomainPart}
				organisations={organisations}
			/>
		);

		expect(Text).toHaveBeenCalledWith(
			expect.objectContaining({
				size: 'small',
				children: ['Lokal identifikator: ', 'someOtherIdentifier'],
			}),
			expect.any(Object)
		);
	});

	describe('Affiliations', () => {
		it('Renders AffiliationDisplay for each affiliation', () => {
			render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={organisations}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenCalledTimes(1);

			render(
				<FormPersonDomainPartView
					personDomainPart={
						formPersonDomainPartWithMultipleAffiliations
					}
					organisations={organisations}
				/>
			);
			expect(AffiliationDisplay).toHaveBeenCalledTimes(5);
		});

		it('Passes organisations name to AffiliationDisplay', () => {
			const currentOrganisations = new Map<string, string>();
			currentOrganisations.set('someId', 'someName');

			render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={currentOrganisations}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenLastCalledWith(
				expect.objectContaining({
					affiliation: {
						name: 'someName',
						fromYear: expect.any(String),
						untilYear: expect.any(String),
					},
				}),
				expect.any(Object)
			);

			currentOrganisations.set('someId', 'someOtherName');

			render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={currentOrganisations}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenLastCalledWith(
				expect.objectContaining({
					affiliation: {
						name: 'someOtherName',
						fromYear: expect.any(String),
						untilYear: expect.any(String),
					},
				}),
				expect.any(Object)
			);
		});

		it('If organisationID is not in organisationMap, passes id to AffiliationDIsplay', () => {
			const currentOrganisations = new Map<string, string>();
			currentOrganisations.set('someOtherId', 'someName');

			render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={currentOrganisations}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenLastCalledWith(
				expect.objectContaining({
					affiliation: {
						name: 'someId',
						fromYear: expect.any(String),
						untilYear: expect.any(String),
					},
				}),
				expect.any(Object)
			);
		});

		it('Passes fromYear and untilYear to AffiliationDisplay', () => {
			render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={organisations}
				/>
			);

			expect(AffiliationDisplay).toHaveBeenLastCalledWith(
				expect.objectContaining({
					affiliation: {
						name: expect.any(String),
						fromYear: '1990',
						untilYear: '2000',
					},
				}),
				expect.any(Object)
			);

			render(
				<FormPersonDomainPartView
					personDomainPart={
						formPersonDomainPartWithMultipleAffiliations
					}
					organisations={organisations}
				/>
			);

			expectNthCallToAffiliationDisplayWithFromAndUntilYear(
				2,
				'1930',
				'1950'
			);
			expectNthCallToAffiliationDisplayWithFromAndUntilYear(
				3,
				'',
				'2002'
			);
			expectNthCallToAffiliationDisplayWithFromAndUntilYear(
				4,
				'2010',
				''
			);
			expectNthCallToAffiliationDisplayWithFromAndUntilYear(5, '', '');
		});
	});

	describe('Affiliation structure', () => {
		it('renders listitem for each affiliation', () => {
			const { rerender } = render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={organisations}
				/>
			);

			expect(screen.getAllByRole('listitem')).toHaveLength(1);

			rerender(
				<FormPersonDomainPartView
					personDomainPart={
						formPersonDomainPartWithMultipleAffiliations
					}
					organisations={organisations}
				/>
			);
			expect(screen.getAllByRole('listitem')).toHaveLength(4);
		});

		it('renders list if theres an affiliation', () => {
			render(
				<FormPersonDomainPartView
					personDomainPart={
						defaultFormPersonDomainPartWithAffiliation
					}
					organisations={organisations}
				/>
			);

			expect(screen.getAllByRole('list')).toHaveLength(1);
		});

		it('does not render list or list items if there is no affiliation', () => {
			render(
				<FormPersonDomainPartView
					personDomainPart={minimalFormPersonDomainPart}
					organisations={organisations}
				/>
			);

			expect(screen.queryAllByRole('list')).toHaveLength(0);
			expect(screen.queryAllByRole('listitem')).toHaveLength(0);
		});
	});
});

const expectNthCallToAffiliationDisplayWithFromAndUntilYear = (
	n: number,
	fromYear: string,
	untilYear: string
) => {
	expect(AffiliationDisplay).toHaveBeenNthCalledWith(
		n,
		expect.objectContaining({
			affiliation: {
				name: expect.any(String),
				fromYear,
				untilYear,
			},
		}),
		expect.any(Object)
	);
};

function expectHeadingWithText(name: string) {
	expect(screen.getByRole('heading', { name })).toBeInTheDocument();
}
