import Listable from './Listable';
import Name from './Name';

import OtherID from './OtherID';

class Person implements Listable {
	id: string;

	authorisedName: Name;

	domains?: string[];

	otherIds: OtherID[];

	constructor(id: string, authorisedName: Name) {
		this.id = id;
		this.authorisedName = authorisedName;
		this.otherIds = [];
	}

	setDomains = (domains: string[]) => {
		this.domains = domains;
	};

	setOtherIds = (otherIds: OtherID[]) => {
		this.otherIds = otherIds;
	};

	presentation = () => {
		return this.authorisedName.toString();
	};

	getLink = () => {
		return `/person/${this.id}`;
	};
}

export default Person;
