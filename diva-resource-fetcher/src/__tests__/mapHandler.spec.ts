import { deserializeMap, serializeMap } from '../mapHandler';

const someMap = new Map();
someMap.set('someKey', 'someValue');
someMap.set('someKey2', 'someValue2');

const someOtherMap = new Map();
someOtherMap.set('someOtherKey', 'someOtherValue');
someOtherMap.set('someOtherKey2', 'someOtherValue2');
someOtherMap.set('someOtherKey3', 'someOtherValue3');
someOtherMap.set('someOtherKey4', 'someOtherValue4');

const stringifiedMap = '[["someKey","someValue"],["someKey2","someValue2"]]';
const stringifiedMap2 =
	'[["someOtherKey","someOtherValue"],["someOtherKey2","someOtherValue2"],["someOtherKey3","someOtherValue3"],["someOtherKey4","someOtherValue4"]]';

describe('mapHandler', () => {
	describe('serializeMap', () => {
		it('takes map', () => {
			serializeMap(someMap);
		});

		it('returnes stringified map', () => {
			const returnedStringifiedMap = serializeMap(someMap);

			expect(returnedStringifiedMap).toStrictEqual(stringifiedMap);

			const returnedStringifiedMap2 = serializeMap(someOtherMap);

			expect(returnedStringifiedMap2).toStrictEqual(stringifiedMap2);
		});
	});

	describe('deserializeMap', () => {
		it('takes a string', () => {
			deserializeMap(stringifiedMap);
		});

		it('returns parsed Map', () => {
			const returnedMap = deserializeMap(stringifiedMap);

			expect(returnedMap).toStrictEqual(someMap);
		});

		it('throws error if json could not be parsed', () => {
			const error = new Error(
				'Error when deserializing map. Could not parse JSON.'
			);

			try {
				deserializeMap('');
			} catch (unknownError: unknown) {
				const caughtError = <Error>unknownError;

				expect(caughtError).toStrictEqual(error);
			}
		});

		it('throws error if map could not be recreated from JSON', () => {
			const error = new Error(
				'Error when deserializing map. Could not convert to map.'
			);

			try {
				deserializeMap('["someOtherKey","someOtherValue"]');
			} catch (unknownError: unknown) {
				const caughtError = <Error>unknownError;

				expect(caughtError).toStrictEqual(error);
			}
		});
	});
});
