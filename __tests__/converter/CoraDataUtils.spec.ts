import {
	getAllChildrenWithNameInData,
	getFirstChildWithNameInData,
} from '../../src/converter/CoraDataUtils';
import {
	DataGroup,
	DataElement,
	DataAtomic,
} from '../../src/converter/CoraData';

describe('getAllChildrenWithNameInData', () => {
	it('should return empty list if there are no children', () => {
		const dataGroupWithEmptyChildren: DataGroup = {
			name: 'someName',
			children: [],
		};

		const children = getAllChildrenWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);

		expect(children).toStrictEqual([]);
		expect(children).toHaveLength(0);
	});
	it('should return empty list if no child with given name in data exists', () => {
		const dataGroupWithNonMatchingChildren: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someUninterestingName',
					value: 'someValue',
				},
				{
					name: 'someOtherUninterestingName',
					value: 'someOtherValue',
				},
			],
		};

		const children = getAllChildrenWithNameInData(
			dataGroupWithNonMatchingChildren,
			'someChildName'
		);

		expect(children).toStrictEqual([]);
		expect(children).toHaveLength(0);
	});
	it('should return a list containing all dataElements with given name in data', () => {
		const dataGroupWithSomeMatchingChildren: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someUninterestingName',
					value: 'someValue',
				},
				{
					name: 'someInterestingName',
					value: 'someInterestingValue',
				},
				{
					name: 'someOtherUninterestingName',
					value: 'someOtherValue',
				},
				{
					name: 'someInterestingName',
					value: 'someOtherInterestingValue',
				},
				{
					name: 'someInterestingName',
					value: 'someOther2InterestingValue',
				},
			],
		};

		const children = getAllChildrenWithNameInData(
			dataGroupWithSomeMatchingChildren,
			'someInterestingName'
		);

		expect(children).toStrictEqual([
			{
				name: 'someInterestingName',
				value: 'someInterestingValue',
			},
			{
				name: 'someInterestingName',
				value: 'someOtherInterestingValue',
			},
			{
				name: 'someInterestingName',
				value: 'someOther2InterestingValue',
			},
		]);
		expect(children).toHaveLength(3);
	});
	it('should not return dataElements with non-matching name in data', () => {
		const dataGroupWithSomeMatchingChildren: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someUninterestingName',
					value: 'someValue',
				},
				{
					name: 'someInterestingName',
					value: 'someInterestingValue',
				},
				{
					name: 'someOtherUninterestingName',
					value: 'someOtherValue',
				},
				{
					name: 'someInterestingName',
					value: 'someOtherInterestingValue',
				},
				{
					name: 'someInterestingName',
					value: 'someOther2InterestingValue',
				},
			],
		};

		const children = getAllChildrenWithNameInData(
			dataGroupWithSomeMatchingChildren,
			'someInterestingName'
		);

		expect(children).not.toContain({
			name: 'someUninterestingName',
			value: 'someValue',
		});
		expect(children).not.toContain({
			name: 'someOtherUninterestingName',
			value: 'someOtherValue',
		});
	});
});

describe('getFirstChildWithNameInData', () => {
	it('should return null if no child exists', () => {
		const dataGroupWithEmptyChildren: DataGroup = {
			name: 'someName',
			children: [],
		};

		expect(
			getFirstChildWithNameInData(dataGroupWithEmptyChildren, 'someChildName')
		).toBe(null);
	});

	it('should return null if no matching child exists', () => {
		const dataGroupWithNonMatchingChildren: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someUninterestingName',
					value: 'someValue',
				},
			],
		};

		expect(
			getFirstChildWithNameInData(
				dataGroupWithNonMatchingChildren,
				'someChildName'
			)
		).toBe(null);

		expect(
			getFirstChildWithNameInData(
				dataGroupWithNonMatchingChildren,
				'someOtherChildName'
			)
		).toBe(null);
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

		const child2 = <DataElement>(
			getFirstChildWithNameInData(
				dataGroupWithOneMatchingAndOneOtherChild,
				'someOtherChildName'
			)
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
