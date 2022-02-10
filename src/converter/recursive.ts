export const recursion = (count: number): number => {
	if (count < 3) {
		count++;
		return recursion(count);
	}

	return count;
};

export const memoization = (num, hash = { '0': 0, '1': 1 }) => {
	if (hash[num - 1] === undefined) {
		hash[num - 1] = memoization(num - 1, hash); // <= call memoization using the module
	}
	return hash[num - 1] + hash[num - 2];
};

export default { recursion };
