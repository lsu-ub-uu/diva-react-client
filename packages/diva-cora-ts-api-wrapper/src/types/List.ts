import { Record } from '../../dist/types';

export class List {
	fromNumber: number;

	toNumber: number;

	totalNumber: number;

	data: Record[];

	constructor(
		data: Record[],
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
