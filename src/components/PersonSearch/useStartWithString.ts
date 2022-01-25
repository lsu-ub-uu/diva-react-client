import useStart from './useStart';

const DEFAULT_START = 1;
const RADIX = 10;

const useStartWithString = (startString: string) => {
	const parsedStart = parseInt(startString, RADIX);
	const start = Number.isNaN(parsedStart) ? DEFAULT_START : parsedStart;
	return useStart(start);
};

export default useStartWithString;
