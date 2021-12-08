interface Listable {
	id: string;
	presentation(): string;
	getLink(): string;
}

export default Listable;
