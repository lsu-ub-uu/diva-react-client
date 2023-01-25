import * as cdu from '../CoraDataUtils';
import { DataGroup, DataElement, DataAtomic } from '../CoraData';

const getAllDataGroupsWithNameInDataAndAttributesSpy = jest.spyOn(
	cdu,
	'getAllDataGroupsWithNameInDataAndAttributes'
);

const dataGroupWithEmptyChildren: DataGroup = {
	name: 'someName',
	children: [],
};

const dataGroupWithNonMatchingDataElements: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someUninterestingChildName',
			value: 'someValue',
		},
		{
			name: 'someOtherUninterestingChildName',
			value: 'someValue',
		},
		{
			name: 'someUninterestingChildName',
			children: [
				{
					name: 'someOtherUninterestingChildName',
					value: 'someValue',
				},
			],
		},
	],
};

const dataGroupWithOnlyMatchingAtomics: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someInterestingChildName',
			value: 'someValue',
		},
		{
			name: 'someInterestingChildName',
			value: 'someOtherValue',
		},
		{
			name: 'someUninterestingChildName',
			children: [
				{
					name: 'someOtherUninterestingChildName',
					value: 'someValue',
				},
			],
		},
	],
};

const dataGroupWithOnlyMatchingGroups: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherUninterestingChildName',
					value: 'someValue',
				},
			],
		},
		{
			name: 'someOtherUninterestingChildName',
			value: 'someValue',
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherUninterestingChildName',
					value: 'someValue',
				},
			],
		},
	],
};

const dataGroupWithOneMatchingAtomicAndOneMatchingGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someUninterestingChildName',
			value: 'someValue',
		},
		{
			name: 'someOtherUninterestingChildName',
			value: 'someValue',
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherChild',
					value: 'someValue',
				},
			],
		},
		{
			name: 'someInterestingChildName',
			value: 'someValue',
		},
	],
};

const dataGroupWithSeveralMatchingDataGroups: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'firstChild',
					value: 'someValue',
				},
			],
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'secondChild',
					value: 'someValue',
				},
			],
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'thirdChild',
					value: 'someValue',
				},
			],
		},
	],
};
const dataGroupWithSeveralMatchingAtomics: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someInterestingChildName',
			value: 'firstMatch',
		},
		{
			name: 'someInterestingChildName',
			value: 'second',
		},
		{
			name: 'someInterestingChildName',
			value: 'third',
		},
	],
};

describe('getAllChildrenWithNameInData', () => {
	it('should return empty list if there are no children', () => {
		const children = cdu.getAllChildrenWithNameInData(
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

		const children = cdu.getAllChildrenWithNameInData(
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

		const children = cdu.getAllChildrenWithNameInData(
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

		const children = cdu.getAllChildrenWithNameInData(
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
		expect(
			cdu.getFirstChildWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toBe(null);
	});

	it('should return null if no matching child exists', () => {
		expect(
			cdu.getFirstChildWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toBe(null);

		expect(
			cdu.getFirstChildWithNameInData(
				dataGroupWithNonMatchingDataElements,
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
			cdu.getFirstChildWithNameInData(
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
			cdu.getFirstChildWithNameInData(
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
			cdu.getFirstChildWithNameInData(
				dataGroupWithMultipleMatchingChildren,
				'someChildName'
			)
		);
		expect(child).not.toBe(undefined);
		expect(child.name).toBe('someChildName');
		expect(child.value).toBe('someValue');
	});
});

describe('getFirstDataAtomicWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		cdu.getFirstDataAtomicWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});

	it('if dataGroup has no children, should return undefined', () => {
		expect(
			cdu.getFirstDataAtomicWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching child, should return undefined', () => {
		expect(
			cdu.getFirstDataAtomicWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching DataAtomic, should return undefined', () => {
		expect(
			cdu.getFirstDataAtomicWithNameInData(
				dataGroupWithOnlyMatchingGroups,
				'someInterestingChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has matching DataAtomic, should return that DataAtomic', () => {
		expect(
			cdu.getFirstDataAtomicWithNameInData(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroup,
				'someInterestingChildName'
			)
		).toStrictEqual({
			name: 'someInterestingChildName',
			value: 'someValue',
		});
	});
	it('if dataGroup has several matching DataAtomics, should return the first of them', () => {
		expect(
			cdu.getFirstDataAtomicWithNameInData(
				dataGroupWithSeveralMatchingAtomics,
				'someInterestingChildName'
			)
		).toStrictEqual({
			name: 'someInterestingChildName',
			value: 'firstMatch',
		});
	});
});

describe('getAllDataAtomicsWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		cdu.getAllDataAtomicsWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});
	it('if dataGroup has no children, should return empty array', () => {
		expect(
			cdu.getAllDataAtomicsWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has no matching children, should return empty array', () => {
		expect(
			cdu.getAllDataAtomicsWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has no matching DataAtomic, should return empty array', () => {
		expect(
			cdu.getAllDataAtomicsWithNameInData(
				dataGroupWithOnlyMatchingGroups,
				'someInterestingChildName'
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has matching DataAtomic, should return array containing that DataAtomic', () => {
		expect(
			cdu.getAllDataAtomicsWithNameInData(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroup,
				'someInterestingChildName'
			)
		).toStrictEqual([
			{ name: 'someInterestingChildName', value: 'someValue' },
		]);
	});
	it('if dataGroup has several matching DataAtomic, should return array containing all the matching DataAtomics', () => {
		expect(
			cdu.getAllDataAtomicsWithNameInData(
				dataGroupWithSeveralMatchingAtomics,
				'someInterestingChildName'
			)
		).toStrictEqual([
			{ name: 'someInterestingChildName', value: 'firstMatch' },
			{ name: 'someInterestingChildName', value: 'second' },
			{ name: 'someInterestingChildName', value: 'third' },
		]);
	});
});

describe('getFirstDataGroupWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		cdu.getFirstDataGroupWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});
	it('if dataGroup has no children, should return undefined', () => {
		expect(
			cdu.getFirstDataGroupWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching child, should return undefined', () => {
		expect(
			cdu.getFirstDataGroupWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching DataGroup, should return undefined', () => {
		expect(
			cdu.getFirstDataGroupWithNameInData(
				dataGroupWithOnlyMatchingAtomics,
				'someInterestingChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has matching DataGroup, should return that DataGroup', () => {
		expect(
			cdu.getFirstDataGroupWithNameInData(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroup,
				'someInterestingChildName'
			)
		).toStrictEqual({
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherChild',
					value: 'someValue',
				},
			],
		});
	});
	it('if dataGroup has several matching DataGroups, should return the first of them', () => {
		expect(
			cdu.getFirstDataGroupWithNameInData(
				dataGroupWithSeveralMatchingDataGroups,
				'someInterestingChildName'
			)
		).toStrictEqual({
			name: 'someInterestingChildName',
			children: [
				{
					name: 'firstChild',
					value: 'someValue',
				},
			],
		});
	});
});

const dataGroupWithNonMatchingAttributes: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherUninterestingChildName',
					value: 'someValue',
				},
			],
			attributes: {
				someUninterestingKey: 'someUninterestingValue',
			},
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherUninterestingChildName',
					value: 'someValue',
				},
			],
			attributes: {
				someOtherUninterestingKey: 'someOtherUninterestingValue',
			},
		},
	],
};

const dataGroupWithOneMatchingAtomicAndOneMatchingGroupWithAttributes: DataGroup =
	{
		name: 'someName',
		children: [
			{
				name: 'someUninterestingChildName',
				value: 'someValue',
			},
			{
				name: 'someOtherUninterestingChildName',
				value: 'someValue',
			},
			{
				name: 'someInterestingChildName',
				children: [
					{
						name: 'someOtherChild',
						value: 'someValue',
					},
				],
			},
			{
				name: 'someInterestingChildName',
				children: [
					{
						name: 'someOtherChild',
						value: 'someValue',
					},
				],
				attributes: {
					someUninterestingKey: 'someUninterestingValue',
				},
			},
			{
				name: 'someInterestingChildName',
				children: [
					{
						name: 'someOtherChild',
						value: 'someValue',
					},
				],
				attributes: {
					someInterestingKey: 'someInterestingValue',
				},
			},
			{
				name: 'someInterestingChildName',
				value: 'someValue',
			},
		],
	};
const dataGroupWithMultipleMatchingGroupWithAttributes: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherChild',
					value: 'someValue',
				},
			],
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'childOfTheFirstMatchingDataGroup',
					value: 'someValue',
				},
			],
			attributes: {
				someInterestingKey: 'someInterestingValue',
			},
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherChild',
					value: 'someValue',
				},
			],
			attributes: {
				someUninterestingKey: 'someUninterestingValue',
			},
		},
		{
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherChild',
					value: 'someValue',
				},
			],
			attributes: {
				someInterestingKey: 'someInterestingValue',
			},
		},
		{
			name: 'someInterestingChildName',
			value: 'someValue',
		},
	],
};

describe('getFirstDataGroupWithNameInDataAndAttribues', () => {
	it('should take dataGroup, nameInData and AttributeMatcher', () => {
		cdu.getFirstDataGroupWithNameInDataAndAttribues(
			dataGroupWithEmptyChildren,
			'someChildName',
			{ someKey: 'someValue' }
		);
	});

	it('should call getAllDataGroupsWithNameInDataAndAttributes with dataGroup, nameInData and attributes', () => {
		cdu.getFirstDataGroupWithNameInDataAndAttribues(
			dataGroupWithEmptyChildren,
			'someChildName',
			{ someKey: 'someValue' }
		);

		expect(
			getAllDataGroupsWithNameInDataAndAttributesSpy
		).toHaveBeenCalledTimes(1);

		expect(
			getAllDataGroupsWithNameInDataAndAttributesSpy
		).toHaveBeenLastCalledWith(
			dataGroupWithEmptyChildren,
			'someChildName',
			{
				someKey: 'someValue',
			}
		);

		cdu.getFirstDataGroupWithNameInDataAndAttribues(
			dataGroupWithMultipleMatchingGroupWithAttributes,
			'someOtherChildName',
			{ someOtherKey: 'someOtherValue' }
		);

		expect(
			getAllDataGroupsWithNameInDataAndAttributesSpy
		).toHaveBeenCalledTimes(2);

		expect(
			getAllDataGroupsWithNameInDataAndAttributesSpy
		).toHaveBeenLastCalledWith(
			dataGroupWithMultipleMatchingGroupWithAttributes,
			'someOtherChildName',
			{ someOtherKey: 'someOtherValue' }
		);
	});
	it('if getAllDataGroupsWithNameInDataAndAttributes returns empty array, return undefined', () => {
		const returned = cdu.getFirstDataGroupWithNameInDataAndAttribues(
			dataGroupWithEmptyChildren,
			'someChildName',
			{ someKey: 'someValue' }
		);

		expect(returned).toBeUndefined();
	});
	it('if getAllDataGroupsWithNameInDataAndAttributes returns non-empty array, return first element from array', () => {
		expect(
			cdu.getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithSeveralMatchingDataGroups,
				'someInterestingChildName'
			)
		).toStrictEqual({
			name: 'someInterestingChildName',
			children: [
				{
					name: 'firstChild',
					value: 'someValue',
				},
			],
		});

		expect(
			cdu.getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroup,
				'someInterestingChildName'
			)
		).toStrictEqual({
			name: 'someInterestingChildName',
			children: [
				{
					name: 'someOtherChild',
					value: 'someValue',
				},
			],
		});
	});
});

describe('getAllDataGroupsWithNameInDataAndAttributes', () => {
	it('should take dataGroup, nameInData and AttributeMatcher', () => {
		cdu.getAllDataGroupsWithNameInDataAndAttributes(
			dataGroupWithEmptyChildren,
			'someChildName',
			{ someKey: 'someValue' }
		);
	});
	it('if dataGroup has no children, should return empty array', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithEmptyChildren,
				'someChildName',
				{ someKey: 'someValue' }
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has empty nameInData, should return empty array', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithEmptyChildren,
				'',
				{ someKey: 'someValue' }
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has no matching child, should return empty array', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithNonMatchingDataElements,
				'someChildName',
				{ someKey: 'someValue' }
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has no matching DataGroup, should return empty array', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithOnlyMatchingAtomics,
				'someInterestingChildName',
				{ someKey: 'someValue' }
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has child with maching nameInData, but not attribute, should return empty array', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithNonMatchingAttributes,
				'someInterestingChildName',
				{ someKey: 'someValue' }
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has child matching both nameInData and attribute, should return array containing that DataGroup', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroupWithAttributes,
				'someInterestingChildName',
				{
					someInterestingKey: 'someInterestingValue',
				}
			)
		).toStrictEqual([
			{
				name: 'someInterestingChildName',
				children: [
					{
						name: 'someOtherChild',
						value: 'someValue',
					},
				],
				attributes: {
					someInterestingKey: 'someInterestingValue',
				},
			},
		]);
	});

	it('if dataGroup has multiple children matching both nameInData and attribute, should return all of them', () => {
		expect(
			cdu.getAllDataGroupsWithNameInDataAndAttributes(
				dataGroupWithMultipleMatchingGroupWithAttributes,
				'someInterestingChildName',
				{
					someInterestingKey: 'someInterestingValue',
				}
			)
		).toStrictEqual([
			{
				name: 'someInterestingChildName',
				children: [
					{
						name: 'childOfTheFirstMatchingDataGroup',
						value: 'someValue',
					},
				],
				attributes: {
					someInterestingKey: 'someInterestingValue',
				},
			},
			{
				name: 'someInterestingChildName',
				children: [
					{
						name: 'someOtherChild',
						value: 'someValue',
					},
				],
				attributes: {
					someInterestingKey: 'someInterestingValue',
				},
			},
		]);
	});

	describe('with no passed attributesToMatch', () => {
		it('if dataGroup has matching DataGroup, should return array containing that DataGroup', () => {
			expect(
				cdu.getAllDataGroupsWithNameInDataAndAttributes(
					dataGroupWithOneMatchingAtomicAndOneMatchingGroup,
					'someInterestingChildName'
				)
			).toStrictEqual([
				{
					name: 'someInterestingChildName',
					children: [
						{
							name: 'someOtherChild',
							value: 'someValue',
						},
					],
				},
			]);
		});
		it('if dataGroup has several matching DataGroups, should return all of them', () => {
			expect(
				cdu.getAllDataGroupsWithNameInDataAndAttributes(
					dataGroupWithSeveralMatchingDataGroups,
					'someInterestingChildName'
				)
			).toStrictEqual([
				{
					name: 'someInterestingChildName',
					children: [
						{
							name: 'firstChild',
							value: 'someValue',
						},
					],
				},
				{
					name: 'someInterestingChildName',
					children: [
						{
							name: 'secondChild',
							value: 'someValue',
						},
					],
				},
				{
					name: 'someInterestingChildName',
					children: [
						{
							name: 'thirdChild',
							value: 'someValue',
						},
					],
				},
			]);
		});
	});
});
