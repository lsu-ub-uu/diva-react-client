import Listable from './Listable';

class List {
	fromNumber: number;

	toNumber: number;

	totalNumber: number;

	data: Listable[];

	constructor(
		data: Listable[],
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
