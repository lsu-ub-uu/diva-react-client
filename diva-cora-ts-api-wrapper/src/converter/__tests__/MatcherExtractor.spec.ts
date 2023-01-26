import { FieldMatcher, Matcher } from '../Converter';
import extractWithMatcher from '../MatcherExtractor';
import { DataGroup } from '../../cora-data/CoraData';
import { possiblySetReturnValue } from '../ElementSetter';
import { extractAndReturnChildren } from '../FieldMatcherExtractor';

jest.mock('../FieldMatcherExtractor');

const mockExtractAndReturnChildren =
	extractAndReturnChildren as jest.MockedFunction<
		typeof extractAndReturnChildren
	>;

jest.mock('../ElementSetter');

const mockPossiblySetReturnValue =
	possiblySetReturnValue as jest.MockedFunction<
		typeof possiblySetReturnValue
	>;

beforeAll(() => {
	mockExtractAndReturnChildren.mockReturnValue('someAtomicString');
	mockPossiblySetReturnValue.mockReturnValue({
		someKey: 'someDefaultReturnFromPossiblySetReturnValue',
	});
});

const defaultTestDataGroup: DataGroup = {
	name: 'someName',
	children: [
		{
			name: 'someAtomicName',
			value: 'someAtomicValue',
		},
	],
};

const defaultTestObjectMatchers: FieldMatcher[] = [
	{
		propertyName: 'someDefaultAtomicName',
		nameInDataPath: 'someDefaultAtomicName',
	},
];

const objectMatcherWithRequired: Matcher = [
	{
		propertyName: 'someRequiredAtomic',
		nameInDataPath: 'someRequiredAtomicNameInData',
		required: true,
	},
	{
		propertyName: 'someNonRequiredAtomic',
		nameInDataPath: 'someNonRequiredNameInData',
	},
	{
		propertyName: 'someNonRequiredAtomic',
		nameInDataPath: 'someNonRequiredNameInData',
		required: false,
	},
];

const objectMatcherWithMultiple: Matcher = [
	{
		propertyName: 'someMultipleAtomic',
		nameInDataPath: 'someMultipleAtomicNameInData',
		multiple: true,
	},
	{
		propertyName: 'someNonMultipleAtomic',
		nameInDataPath: 'someNonMultipleNameInData',
	},
	{
		propertyName: 'someNonMultipleAtomic',
		nameInDataPath: 'someNonMultipleNameInData',
		multiple: false,
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

const matcherWithFourFieldMatchers: Matcher = [
	{
		propertyName: 'someAtomicName',
		nameInDataPath: 'someAtomicName',
	},
	{
		propertyName: 'someAtomicName2',
		nameInDataPath: 'someAtomicName',
	},
	{
		propertyName: 'someAtomicName3',
		nameInDataPath: 'someAtomicName',
	},
	{
		propertyName: 'someAtomicName4',
		nameInDataPath: 'someAtomicName',
	},
];

describe('The MatcherExtractor', () => {
	describe('extractWithMatcher', () => {
		it('takes a DataGroup and a top-level-matcher', () => {
			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);
		});

		it('calls extractAndReturnChildren for each matcher', () => {
			extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(4);

			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(5);
		});

		it('calls extractAndReturnChildren with dataGroup', () => {
			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				1,
				defaultTestDataGroup,
				expect.any(Object)
			);

			extractWithMatcher(
				someDataGroupWithTwoChildren,
				defaultTestObjectMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(2);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				2,
				someDataGroupWithTwoChildren,
				expect.any(Object)
			);

			extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(6);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				3,
				defaultTestDataGroup,
				expect.any(Object)
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				6,
				defaultTestDataGroup,
				expect.any(Object)
			);
		});

		it('calls extractAndReturnChildren with each matcher', () => {
			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				1,
				expect.any(Object),
				defaultTestObjectMatchers[0]
			);

			extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				2,
				expect.any(Object),
				matcherWithFourFieldMatchers[0]
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				3,
				expect.any(Object),
				matcherWithFourFieldMatchers[1]
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				5,
				expect.any(Object),
				matcherWithFourFieldMatchers[3]
			);
		});

		it('calls possiblySetReturnValue for each call to extractAndReturnChildren', () => {
			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);

			expect(mockPossiblySetReturnValue).toHaveBeenCalledTimes(1);

			extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenCalledTimes(5);
		});

		it("calls possibleSetReturnValue with each matcher's field", () => {
			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				1,
				expect.any(String),
				'someDefaultAtomicName',
				undefined,
				undefined
			);

			extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				2,
				expect.any(String),
				'someAtomicName',
				undefined,
				undefined
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				5,
				expect.any(String),
				'someAtomicName4',
				undefined,
				undefined
			);
		});

		it("calls possibleSetReturnValue with each matcher's required", () => {
			extractWithMatcher(defaultTestDataGroup, objectMatcherWithRequired);
			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				1,
				expect.any(String),
				expect.any(String),
				true,
				undefined
			);
			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				2,
				expect.any(String),
				expect.any(String),
				undefined,
				undefined
			);
			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				3,
				expect.any(String),
				expect.any(String),
				false,
				undefined
			);
		});

		it("calls possibleSetReturnValue with each matcher's multiple", () => {
			extractWithMatcher(defaultTestDataGroup, objectMatcherWithMultiple);
			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				1,
				expect.any(String),
				expect.any(String),
				undefined,
				true
			);
			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				2,
				expect.any(String),
				expect.any(String),
				undefined,
				undefined
			);
			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				3,
				expect.any(String),
				expect.any(String),
				undefined,
				false
			);
		});

		it('calls possibleSetReturnValue with whatever extractAndReturnChildren returns', () => {
			mockExtractAndReturnChildren.mockReturnValueOnce('someString');

			extractWithMatcher(defaultTestDataGroup, defaultTestObjectMatchers);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				1,
				'someString',
				expect.any(String),
				undefined,
				undefined
			);

			mockExtractAndReturnChildren.mockReturnValueOnce(undefined);
			mockExtractAndReturnChildren.mockReturnValueOnce([
				'someString',
				'someOtherString',
			]);
			mockExtractAndReturnChildren.mockReturnValueOnce({
				someNiceKey: 'someNiceValue',
			});
			mockExtractAndReturnChildren.mockReturnValueOnce('');

			extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				2,
				undefined,
				expect.any(String),
				undefined,
				undefined
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				3,
				['someString', 'someOtherString'],
				expect.any(String),
				undefined,
				undefined
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				4,
				{
					someNiceKey: 'someNiceValue',
				},
				expect.any(String),
				undefined,
				undefined
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				5,
				'',
				expect.any(String),
				undefined,
				undefined
			);
		});

		it('if possiblySetReturnValue returns undefined, returns empty object', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce(undefined);
			const returned = extractWithMatcher(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({});
		});

		it('if possiblySetReturnValue returns empty object, returns empty object', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({});
			const returned = extractWithMatcher(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({});
		});

		it('if possiblySetReturnValue returns object, returns it in an object (one matcher)', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey: 'someValue',
			});
			let returned = extractWithMatcher(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({ someKey: 'someValue' });

			mockPossiblySetReturnValue.mockReturnValueOnce({
				someOtherKey: 'someOtherField',
			});
			returned = extractWithMatcher(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({ someOtherKey: 'someOtherField' });
		});

		it('if possiblySetReturnValue returns object with several keys, only returns the first', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey: 'someValue',
				someAdditionalKey: 'someAdditionalValue',
			});
			const returned = extractWithMatcher(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({ someKey: 'someValue' });
		});

		it('takes what possiblySetReturnValue returns and returns it in an object (multiple matchers)', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey: 'someValue',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey2: 'someValue2',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey3: 'someValue3',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey4: 'someValue4',
			});
			const returned = extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(returned).toStrictEqual({
				someKey: 'someValue',
				someKey2: 'someValue2',
				someKey3: 'someValue3',
				someKey4: 'someValue4',
			});
		});

		it('takes what possiblySetReturnValue returns and returns it in an object, skips empty objects (multiple matchers)', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey: 'someValue',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey3: 'someValue3',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({});
			const returned = extractWithMatcher(
				defaultTestDataGroup,
				matcherWithFourFieldMatchers
			);

			expect(returned).toStrictEqual({
				someKey: 'someValue',
				someKey3: 'someValue3',
			});
		});
	});
});
