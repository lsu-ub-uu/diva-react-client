class List<T> {
	fromNumber: number;

	toNumber: number;

	totalNumber: number;

	data: T[];

	constructor(
		data: T[],
		fromNumber: number,
		toNumber: number,
		totalNumber: number
	) {
		this.data = data;
		this.fromNumber = fromNumber;
		this.toNumber = toNumber;
		this.totalNumber = totalNumber;
	}
}

export default List;
