import convertToObject, { FieldMatcher, Matcher } from './Converter';
import { DataGroup } from './CoraData';
import extractWithMatcher from './MatcherExtractor';

jest.mock('./MatcherExtractor');
const mockExtractWithMatcher = extractWithMatcher as jest.MockedFunction<
	typeof extractWithMatcher
>;

beforeAll(() => {
	mockExtractWithMatcher.mockReturnValue({
		someDefaultKeyFromExtractWithMatcher:
			'someDefaultValueFromExtractWithMatcher',
	});
});

type SomeTestObject = {
	someAtomicName: string;
	someOtherAtomicName?: string;
	someGroup: {
		someAtomic: string;
	};
	someMultiple: string[];
};

const someTestMatcher: Matcher = [
	{
		react: 'someAtomicName',
		cora: 'someAtomicName',
		required: true,
	},
	{
		react: 'someOtherAtomicName',
		cora: 'someOtherAtomicName',
	},
	{
		react: 'someGroup',
		cora: 'someGroup',
		required: true,
		nextMatcher: [
			{
				react: 'someAtomic',
				cora: 'someAtomic',
				required: true,
			},
		],
	},
	{
		react: 'someMultiple',
		cora: 'someMultiple',
		multiple: true,
	},
];

type DefaultTestObject = {
	someAtomicName?: string;
};

const defaultTestDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
	],
};

const defaultTestObjectMatcher: FieldMatcher[] = [
	{
		react: 'someDefaultAtomicName',
		cora: 'someDefaultAtomicName',
	},
];

const someDataGroupWithTwoChildren: DataGroup = {
	name: 'someDataGroupWithTwoChildren',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
		{
			name: 'someAtomicName2',
			value: 'someAtomicValue2',
		},
	],
};

const matcherWithTwoFieldMatchers: FieldMatcher[] = [
	{
		react: 'someAtomicName',
		cora: 'someAtomicName',
	},
	{
		react: 'someAtomicName2',
		cora: 'someAtomicName',
	},
];

describe('The Converter', () => {
	describe('convertToObject', () => {
		it('takes a DataGroup and a top-level-matcher', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatcher
			);
		});

		it('calls extractWithMatcher with dataGroup and matcher', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatcher
			);

			expect(mockExtractWithMatcher).toHaveBeenCalledWith(
				defaultTestDataGroup,
				defaultTestObjectMatcher
			);

			convertToObject<DefaultTestObject>(
				someDataGroupWithTwoChildren,
				matcherWithTwoFieldMatchers
			);

			expect(mockExtractWithMatcher).toHaveBeenCalledWith(
				someDataGroupWithTwoChildren,
				matcherWithTwoFieldMatchers
			);
		});

		it('returns what extractWithMatcher returns and casts it to the provided type', () => {
			mockExtractWithMatcher.mockReturnValueOnce({
				someAtomicName: 'someFirstAtomicValue',
				someOtherAtomicName: 'someOtherAtomicValue',
				someGroup: {
					someAtomic: 'someNestedAtomicValue',
				},
				someMultiple: ['someArrayValue1', 'someArrayValue2'],
			});

			const returned: SomeTestObject = convertToObject<SomeTestObject>(
				defaultTestDataGroup,
				someTestMatcher
			);

			expect(returned).toStrictEqual({
				someAtomicName: 'someFirstAtomicValue',
				someOtherAtomicName: 'someOtherAtomicValue',
				someGroup: {
					someAtomic: 'someNestedAtomicValue',
				},
				someMultiple: ['someArrayValue1', 'someArrayValue2'],
			});

			mockExtractWithMatcher.mockReturnValueOnce({
				someAtomicName: 'someAtomicValue',
			});

			const returned2: DefaultTestObject = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				someTestMatcher
			);

			expect(returned2).toStrictEqual({
				someAtomicName: 'someAtomicValue',
			});
		});
	});
});
