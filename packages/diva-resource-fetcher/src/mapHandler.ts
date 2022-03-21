export const serializeMap = (map: Map<string, string>): string => {
	const serializedMap = JSON.stringify(Array.from(map.entries()));

	return serializedMap;
};

export const deserializeMap = (serializedMap: string): Map<string, string> => {
	let parsedJSON;
	try {
		parsedJSON = JSON.parse(serializedMap);
	} catch (error) {
		throw new Error('Error when deserializing map. Could not parse JSON.');
	}

	let map: Map<string, string>;
	try {
		map = new Map(parsedJSON);
	} catch (error) {
		throw new Error('Error when deserializing map. Could not convert to map.');
	}
	return map;
};

export default { serializeMap };
