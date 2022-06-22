import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from 'grommet';
import FormPersonDomainPartView from './FormPersonDomainPartView';
import {
	completeFormPersonDomainpart,
	minimalFormPersonDomainPart,
} from '../../../testData/personDomainPartObjectData';
import getDomainCollection from '../../divaData/resources';

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

beforeAll(() => {
	const someDomainCollection = new Map();
	someDomainCollection.set('someDomainId', 'Some university');
	someDomainCollection.set('someOtherDomainId', 'Some other university');
	mockGetDomainCollection.mockReturnValue(someDomainCollection);
});

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
		// TODO Affiliations
	});
});

function expectHeadingWithText(name: string) {
	expect(screen.getByRole('heading', { name })).toBeInTheDocument();
}
