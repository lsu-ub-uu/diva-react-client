import {
	getAllChildrenWithNameInData,
	getAllDataAtomicsWithNameInData,
	getFirstChildWithNameInData,
	getFirstDataAtomicWithNameInData,
	getFirstDataGroupWithNameInData,
	getFirstDataGroupWithNameInDataAndAttribues,
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

describe('getFirstChildWithNameInData', () => {
	it('should return null if no child exists', () => {
		expect(
			getFirstChildWithNameInData(dataGroupWithEmptyChildren, 'someChildName')
		).toBe(null);
	});

	it('should return null if no matching child exists', () => {
		expect(
			getFirstChildWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toBe(null);

		expect(
			getFirstChildWithNameInData(
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

describe('getFirstDataAtomicWithNameInData', () => {
	it('should take dataGroup and nameInData', () => {
		getFirstDataAtomicWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});

	it('if dataGroup has no children, should return undefined', () => {
		expect(
			getFirstDataAtomicWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching child, should return undefined', () => {
		expect(
			getFirstDataAtomicWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching DataAtomic, should return undefined', () => {
		expect(
			getFirstDataAtomicWithNameInData(
				dataGroupWithOnlyMatchingGroups,
				'someInterestingChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has matching DataAtomic, should return that DataAtomic', () => {
		expect(
			getFirstDataAtomicWithNameInData(
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
			getFirstDataAtomicWithNameInData(
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
		getAllDataAtomicsWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});
	it('if dataGroup has no children, should return empty array', () => {
		expect(
			getAllDataAtomicsWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has no matching children, should return empty array', () => {
		expect(
			getAllDataAtomicsWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has no matching DataAtomic, should return empty array', () => {
		expect(
			getAllDataAtomicsWithNameInData(
				dataGroupWithOnlyMatchingGroups,
				'someInterestingChildName'
			)
		).toStrictEqual([]);
	});
	it('if dataGroup has matching DataAtomic, should return array containing that DataAtomic', () => {
		expect(
			getAllDataAtomicsWithNameInData(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroup,
				'someInterestingChildName'
			)
		).toStrictEqual([{ name: 'someInterestingChildName', value: 'someValue' }]);
	});
	it('if dataGroup has several matching DataAtomic, should return array containing all the matching DataAtomics', () => {
		expect(
			getAllDataAtomicsWithNameInData(
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
		getFirstDataGroupWithNameInData(
			dataGroupWithEmptyChildren,
			'someChildName'
		);
	});
	it('if dataGroup has no children, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInData(
				dataGroupWithEmptyChildren,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching child, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInData(
				dataGroupWithNonMatchingDataElements,
				'someChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching DataGroup, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInData(
				dataGroupWithOnlyMatchingAtomics,
				'someInterestingChildName'
			)
		).toBe(undefined);
	});
	it('if dataGroup has matching DataGroup, should return that DataGroup', () => {
		expect(
			getFirstDataGroupWithNameInData(
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
			getFirstDataGroupWithNameInData(
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
		getFirstDataGroupWithNameInDataAndAttribues(
			dataGroupWithEmptyChildren,
			'someChildName',
			{ someKey: 'someValue' }
		);
	});
	it('if dataGroup has no children, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithEmptyChildren,
				'someChildName',
				{ someKey: 'someValue' }
			)
		).toBe(undefined);
	});
	it('if dataGroup has empty nameInData, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithEmptyChildren,
				'',
				{ someKey: 'someValue' }
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching child, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithNonMatchingDataElements,
				'someChildName',
				{ someKey: 'someValue' }
			)
		).toBe(undefined);
	});
	it('if dataGroup has no matching DataGroup, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithOnlyMatchingAtomics,
				'someInterestingChildName',
				{ someKey: 'someValue' }
			)
		).toBe(undefined);
	});
	it('if dataGroup has child with maching nameInData, but not attribute, should return undefined', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithNonMatchingAttributes,
				'someInterestingChildName',
				{ someKey: 'someValue' }
			)
		).toBe(undefined);
	});
	it('if dataGroup has child matching both nameInData and attribute, should return that DataGroup', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithOneMatchingAtomicAndOneMatchingGroupWithAttributes,
				'someInterestingChildName',
				{
					someInterestingKey: 'someInterestingValue',
				}
			)
		).toStrictEqual({
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
		});
	});

	it('if dataGroup has multiple children matching both nameInData and attribute, should return the first DataGroup', () => {
		expect(
			getFirstDataGroupWithNameInDataAndAttribues(
				dataGroupWithMultipleMatchingGroupWithAttributes,
				'someInterestingChildName',
				{
					someInterestingKey: 'someInterestingValue',
				}
			)
		).toStrictEqual({
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
		});
	});

	describe('with no passed attributesToMatch', () => {
		it('if dataGroup has matching DataGroup, should return that DataGroup', () => {
			expect(
				getFirstDataGroupWithNameInDataAndAttribues(
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
				getFirstDataGroupWithNameInDataAndAttribues(
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
});
