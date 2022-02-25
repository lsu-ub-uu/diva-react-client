import { render } from '@testing-library/react';
import React from 'react';
import { RecordType, Organisation } from 'diva-cora-ts-api-wrapper';
import useApi from '../../hooks/useApi';
import OrganisationFetcher from '../OrganisationFetcher';
import OrganisationView from './OrganisationView';

const ComponentToTest = OrganisationFetcher;

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

jest.mock('./OrganisationView', () => {
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

const someObject: Organisation = {
	id: 'someId',
	recordType: 'organisation',
	name: 'someOrganisationName',
	alternativeName: 'someAlternativeOrganisationName',
	organisationType: 'subOrgansation',
};

const someOtherObject: Organisation = {
	id: 'someOtherId',
	recordType: 'organisation',
	name: 'someOtherOrganisationName',
	alternativeName: 'someOtherAlternatieOrganisationName',
	organisationType: 'subOrgansation',
};

beforeAll(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: someObject },
		isLoading: false,
		setApiParams: jest.fn(),
	});
});

describe('The ComponentToTest component', () => {
	it('should render RecordFetcher with recordType RecordType.Organisation', () => {
		render(<ComponentToTest id="someId" />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: RecordType.Organisation,
				id: expect.any(String),
			})
		);
	});

	it('should render RecordFetcher id from props', () => {
		render(<ComponentToTest id="someNiceId" />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someNiceId',
			})
		);

		render(<ComponentToTest id="someOtherId" />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someOtherId',
			})
		);
	});

	it('should not render RecordFetcher if id from props is empty string', () => {
		render(<ComponentToTest id="" />);

		expect(mockedRecordFetcher).not.toHaveBeenCalled();
	});

	it('should render OrganisationView with organisation from RecordFetcher', () => {
		render(<ComponentToTest id="someId" />);

		render(<Child record={someObject} />);

		expect(OrganisationView).toHaveBeenCalledTimes(1);
		expect(OrganisationView).toHaveBeenCalledWith(
			expect.objectContaining({
				organisation: someObject,
			}),
			expect.any(Object)
		);
	});

	it('should render OrganisationView with organisation from RecordFetcher', () => {
		render(<ComponentToTest id="someId" />);

		render(<Child record={someOtherObject} />);

		expect(OrganisationView).toHaveBeenCalledTimes(1);
		expect(OrganisationView).toHaveBeenCalledWith(
			expect.objectContaining({
				organisation: someOtherObject,
			}),
			expect.any(Object)
		);
	});
});
