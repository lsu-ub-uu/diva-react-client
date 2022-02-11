import convertToObject, { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import { possiblySetReturnValue } from './ElementSetter';
import { extractAndReturnChildren } from './MatcherExtractor';

jest.mock('./MatcherExtractor');

const mockExtractAndReturnChildren =
	extractAndReturnChildren as jest.MockedFunction<
		typeof extractAndReturnChildren
	>;

jest.mock('./ElementSetter');

const mockPossiblySetReturnValue =
	possiblySetReturnValue as jest.MockedFunction<typeof possiblySetReturnValue>;

beforeAll(() => {
	mockExtractAndReturnChildren.mockReturnValue('someAtomicString');
	mockPossiblySetReturnValue.mockReturnValue({
		someKey: 'someDefaultReturnFromPossiblySetReturnValue',
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

const someTestMatcher: Matcher[] = [
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
		nextMatcher: {
			react: 'someAtomic',
			cora: 'someAtomic',
			required: true,
		},
	},
	{
		react: 'someMultiple',
		cora: 'someMultiple',
		multiple: true,
	},
];

describe('The Converter', () => {
	describe('convertToObject', () => {
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

		const defaultTestObjectMatchers: Matcher[] = [
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

		const multipleMatchers: Matcher[] = [
			{
				react: 'someAtomicName',
				cora: 'someAtomicName',
			},
			{
				react: 'someAtomicName2',
				cora: 'someAtomicName',
			},
			{
				react: 'someAtomicName3',
				cora: 'someAtomicName',
			},
			{
				react: 'someAtomicName4',
				cora: 'someAtomicName',
			},
		];

		it('takes a DataGroup and a top-level-matcher', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);
		});

		it('calls extractAndReturnChildren for each matcher', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(4);

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(5);
		});

		it('calls extractAndReturnChildren with dataGroup', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				1,
				defaultTestDataGroup,
				expect.any(Object)
			);

			convertToObject<DefaultTestObject>(
				someDataGroupWithTwoChildren,
				defaultTestObjectMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenCalledTimes(2);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				2,
				someDataGroupWithTwoChildren,
				expect.any(Object)
			);

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
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
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				1,
				expect.any(Object),
				defaultTestObjectMatchers[0]
			);

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				2,
				expect.any(Object),
				multipleMatchers[0]
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				3,
				expect.any(Object),
				multipleMatchers[1]
			);

			expect(mockExtractAndReturnChildren).toHaveBeenNthCalledWith(
				5,
				expect.any(Object),
				multipleMatchers[3]
			);
		});

		it('calls possiblySetReturnValue for each call to extractAndReturnChildren', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenCalledTimes(1);

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenCalledTimes(5);
		});

		it("calls possibleSetReturnValue with each matcher's field", () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				1,
				expect.any(String),
				'someDefaultAtomicName'
			);

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				2,
				expect.any(String),
				'someAtomicName'
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				5,
				expect.any(String),
				'someAtomicName4'
			);
		});

		it('calls possibleSetReturnValue with whatever extractAndReturnChildren returns', () => {
			mockExtractAndReturnChildren.mockReturnValueOnce('someString');

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				1,
				'someString',
				expect.any(String)
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

			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				2,
				undefined,
				expect.any(String)
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				3,
				['someString', 'someOtherString'],
				expect.any(String)
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				4,
				{
					someNiceKey: 'someNiceValue',
				},
				expect.any(String)
			);

			expect(mockPossiblySetReturnValue).toHaveBeenNthCalledWith(
				5,
				'',
				expect.any(String)
			);
		});

		it('if possiblySetReturnValue returns undefined, returns empty object', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce(undefined);
			const returned = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({});
		});

		it('if possiblySetReturnValue returns empty object, returns empty object', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({});
			const returned = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({});
		});

		it('if possiblySetReturnValue returns object, returns it in an object (one matcher)', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({ someKey: 'someValue' });
			let returned = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({ someKey: 'someValue' });

			mockPossiblySetReturnValue.mockReturnValueOnce({
				someOtherKey: 'someOtherField',
			});
			returned = convertToObject<DefaultTestObject>(
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
			const returned = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatchers
			);

			expect(returned).toStrictEqual({ someKey: 'someValue' });
		});

		it('takes what possiblySetReturnValue returns and returns it in an object (multiple matchers)', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({ someKey: 'someValue' });
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey2: 'someValue2',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey3: 'someValue3',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someKey4: 'someValue4',
			});
			const returned = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
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
			const returned = convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				multipleMatchers
			);

			expect(returned).toStrictEqual({
				someKey: 'someValue',
				someKey3: 'someValue3',
			});
		});

		it('returns an object of the provided type', () => {
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someAtomicName: 'someFirstAtomicValue',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someOtherAtomicName: 'someOtherAtomicValue',
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
				someGroup: {
					someAtomic: 'someNestedAtomicValue',
				},
			});
			mockPossiblySetReturnValue.mockReturnValueOnce({
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
		});
	});
});
