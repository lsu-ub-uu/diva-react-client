const MIN_START_VALUE = 1;

const useStart = (start: number) => {
	const startToReturn = start >= 1 ? start : MIN_START_VALUE;
	return { start: startToReturn };
};

export default useStart;
