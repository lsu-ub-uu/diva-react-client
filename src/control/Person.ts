import Listable from './Listable';
import Name from './Name';

class Person implements Listable {
	id: string;

	authorisedName: Name;

	domains?: string[];

	constructor(id: string, authorisedName: Name) {
		this.id = id;
		this.authorisedName = authorisedName;
	}

	presentation = () => {
		return this.id;
	};
}

export default Person;
