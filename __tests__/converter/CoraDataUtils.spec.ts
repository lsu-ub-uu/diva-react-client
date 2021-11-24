import { getFirstChildWithNameInData } from '../../src/converter/CoraDataUtils';
import {
	DataGroup,
	DataElement,
	DataAtomic,
} from '../../src/converter/CoraData';

describe('getFirstChildWithNameInData', () => {
	it('should throw error if no child exists', () => {
		const dataGroupWithEmptyChildren: DataGroup = {
			name: 'someName',
			children: [],
		};

		expect(() => {
			getFirstChildWithNameInData(dataGroupWithEmptyChildren, 'someChildName');
		}).toThrowError('The DataGroup has no children.');
	});

	it('should throw error if no matching child exists', () => {
		const dataGroupWithEmptyChildren: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someUninterestingName',
					value: 'someValue',
				},
			],
		};

		expect(() => {
			getFirstChildWithNameInData(dataGroupWithEmptyChildren, 'someChildName');
		}).toThrowError(
			'The DataGroup has no child with name in data "someChildName".'
		);

		expect(() => {
			getFirstChildWithNameInData(
				dataGroupWithEmptyChildren,
				'someOtherChildName'
			);
		}).toThrowError(
			'The DataGroup has no child with name in data "someOtherChildName".'
		);
	});

	it('Should return a child with matching name in data if provided with one matching child', () => {
		const dataGroupWithOneMatchingChild: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someChildName',
					value: 'someValue',
				},
			],
		};

		const child: DataAtomic = <DataAtomic>(
			getFirstChildWithNameInData(
				dataGroupWithOneMatchingChild,
				'someChildName'
			)
		);
		expect(child).not.toBe(undefined);
		expect(child.name).toBe('someChildName');
	});

	it('Should return a child with matching name in data if provided with one matching child and one additional', () => {
		const dataGroupWithOneMatchingAndOneOtherChild: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someChildName',
					value: 'someValue',
				},
				{
					name: 'someOtherChildName',
					value: 'someValue',
				},
			],
		};

		const child2: DataElement = getFirstChildWithNameInData(
			dataGroupWithOneMatchingAndOneOtherChild,
			'someOtherChildName'
		);
		expect(child2).not.toBe(undefined);
		expect(child2.name).toBe('someOtherChildName');
	});

	it('Should return the first child with matching name in data', () => {
		const dataGroupWithMultipleMatchingChildren: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someOtherChildName',
					children: [
						{
							name: 'someGrandChildName',
							value: 'someValue',
						},
					],
				},
				{
					name: 'someChildName',
					value: 'someValue',
				},
				{
					name: 'someChildName',
					children: [
						{
							name: 'anotherGrandChildName',
							value: 'someValue',
						},
					],
				},
			],
		};

		const child: DataAtomic = <DataAtomic>(
			getFirstChildWithNameInData(
				dataGroupWithMultipleMatchingChildren,
				'someChildName'
			)
		);
		expect(child).not.toBe(undefined);
		expect(child.name).toBe('someChildName');
		expect(child.value).toBe('someValue');
	});
});
