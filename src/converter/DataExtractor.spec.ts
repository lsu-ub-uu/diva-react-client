import { DataGroup } from './CoraData';
import { getAllDataAtomicValuesWithNameInData } from './DataExtractor';

const someEmptyDataGroup: DataGroup = {
	name: 'someEmptyDataGroup',
	children: [],
};

describe('DataExtractor', () => {
	describe('getAllDataAtomicValuesWithNameInDatas', () => {
		it('takes dataGroup, an array of nameInDatas and possibly matchingAttribues', () => {
			getAllDataAtomicValuesWithNameInData(
				someEmptyDataGroup,
				[],
				[{ key: 'someKey', value: 'someValue' }]
			);
		});

		it('if the array of nameInDatas is empty, returns an empty array', () => {
			const returned = getAllDataAtomicValuesWithNameInData(
				someEmptyDataGroup,
				[],
				[{ key: 'someKey', value: 'someValue' }]
			);

			expect(returned).toStrictEqual([]);
		});
		it('if the dataGroup does not contain any elements, returns an empty array', () => {
			const returned = getAllDataAtomicValuesWithNameInData(
				someEmptyDataGroup,
				[]
			);

			expect(returned).toStrictEqual([]);
		});
		it('if the dataGroup does not contain DataAtomics with matching nameInDatas, returns an empty array', () => {
			const someDataGroup: DataGroup = {
				name: 'someDataGroup',
				children: [
					{
						name: 'someAtomic',
						value: 'someAtomic',
					},
					{
						name: 'someOtherAtomic',
						value: 'someAtomic',
					},
					{
						name: 'someAdditionalAtomic',
						value: 'someAtomic',
					},
					{
						name: 'someVeryUninterestingGroup',
						children: [],
					},
				],
			};

			const returned = getAllDataAtomicValuesWithNameInData(someDataGroup, [
				'someInterestingAtomic',
			]);

			expect(returned).toStrictEqual([]);
		});
		it.todo(
			'if the dataGroup does constain DataAtomics with matching nameInDatas, but none of them match the matchingAttributes, returns an empty array'
		);
		it('if the dataGroup does contain DataAtomics with matching nameInDatas and no matchingAttributes were specified, returns an array containing their values', () => {
			const someDataGroup: DataGroup = {
				name: 'someDataGroup',
				children: [
					{
						name: 'someInterestingNameInData',
						value: 'someAtomic1',
					},
					{
						name: 'someOtherAtomic',
						value: 'someOtherAtomic',
					},
					{
						name: 'someInterestingNameInData',
						value: 'someAtomic2',
					},
				],
			};

			const returned = getAllDataAtomicValuesWithNameInData(someDataGroup, [
				'someInterestingNameInData',
			]);

			expect(returned).toStrictEqual(['someAtomic1', 'someAtomic2']);
		});
		it.todo(
			'if the dataGroup does contain DataAtomics with matching nameInDatas AND matchingAttributes, returns an array containing their values'
		);

		it.todo('does not take into account DataGroups with matching nameInData');
	});
});
