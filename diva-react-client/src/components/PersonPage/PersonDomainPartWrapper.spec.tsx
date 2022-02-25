import { render } from '@testing-library/react';
import React from 'react';
import { RecordType, PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import PersonDomainPartView from './PersonDomainPartView';
import useApi from '../../hooks/useApi';
import PersonDomainPartWrapper from './PersonDomainPartWrapper';

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

jest.mock('./PersonDomainPartView', () => {
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

const somePersonDomainPart: PersonDomainPart = {
	id: 'someId',
	recordType: 'personDomainPart',
	identifiers: ['someIdentifier'],
	domain: 'someDomain',
};

const someOtherPersonDomainPart: PersonDomainPart = {
	id: 'someOtherId',
	recordType: 'personDomainPart',
	identifiers: ['someOtherIdentifier'],
	domain: 'someOtherDomain',
};

beforeAll(() => {
	mockUseApi.mockReturnValue({
		result: { hasData: true, isError: false, data: somePersonDomainPart },
		isLoading: false,
		setApiParams: jest.fn(),
	});
});

describe('The PersonDomainPartWrapper component', () => {
	it('should render RecordFetcher with recordType RecordType.PersonDomainPart', () => {
		render(<PersonDomainPartWrapper id="someId" />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: RecordType.PersonDomainPart,
				id: expect.any(String),
			})
		);
	});

	it('should render RecordFetcher id from props', () => {
		render(<PersonDomainPartWrapper id="someNiceId" />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someNiceId',
			})
		);

		render(<PersonDomainPartWrapper id="someOtherId" />);

		expect(mockedRecordFetcher).toHaveBeenLastCalledWith(
			expect.objectContaining({
				recordType: expect.any(String),
				id: 'someOtherId',
			})
		);
	});

	it('should not render RecordFetcher if id from props is empty string', () => {
		render(<PersonDomainPartWrapper id="" />);

		expect(mockedRecordFetcher).not.toHaveBeenCalled();
	});

	it('should render PersonDomainPartView with personDomainPart from RecordFetcher', () => {
		render(<PersonDomainPartWrapper id="someId" />);

		render(<Child record={somePersonDomainPart} />);

		expect(PersonDomainPartView).toHaveBeenCalledTimes(1);
		expect(PersonDomainPartView).toHaveBeenCalledWith(
			expect.objectContaining({
				personDomainPart: somePersonDomainPart,
			}),
			expect.any(Object)
		);
	});

	it('should render PersonDomainPartView with personDomainPart from RecordFetcher', () => {
		render(<PersonDomainPartWrapper id="someId" />);

		render(<Child record={someOtherPersonDomainPart} />);

		expect(PersonDomainPartView).toHaveBeenCalledTimes(1);
		expect(PersonDomainPartView).toHaveBeenCalledWith(
			expect.objectContaining({
				personDomainPart: someOtherPersonDomainPart,
			}),
			expect.any(Object)
		);
	});
});
