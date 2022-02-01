import Listable from './Listable';
import Name from './Name';

class Person implements Listable {
	id: string;

	authorisedName: Name;

	domains?: string[];

	orcidIDs: string[];

	viafIDs: string[];

	librisIDs: string[];

	constructor(id: string, authorisedName: Name) {
		this.id = id;
		this.authorisedName = authorisedName;
		this.orcidIDs = [];
		this.viafIDs = [];
		this.librisIDs = [];
	}

	setDomains = (domains: string[]) => {
		this.domains = domains;
	};

	presentation = () => {
		return this.authorisedName.toString();
	};

	getLink = () => {
		return `/person/${this.id}`;
	};
}

export default Person;
