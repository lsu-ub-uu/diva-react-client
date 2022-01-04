class List<T> {
	fromNo: number;

	totalNo: number;

	toNo: number;

	data: T[];

	constructor(data: T[], fromNo: number, totalNo: number, toNo: number) {
		this.data = data;
		this.fromNo = fromNo;
		this.totalNo = totalNo;
		this.toNo = toNo;
	}
}

export default List;
