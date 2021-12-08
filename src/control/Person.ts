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

	setDomains = (domains: string[]) => {
		this.domains = domains;
	};

	presentation = () => {
		return this.authorisedName.toString();
	};
}

export default Person;
