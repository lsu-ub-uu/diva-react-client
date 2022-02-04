import ExternalUrl from './ExternalUrl';
import Listable from './Listable';
import Name from './Name';

class Person implements Listable {
	id: string;

	domains?: string[];

	authorisedName: Name;

	academicTitle: string;

	yearOfBirth?: string;

	yearOfDeath?: string;

	emailAddress?: string;

	alternativeNames: Name[];

	externalURLs: ExternalUrl[];

	otherAffiliation?: {
		affiliation: string;
		affiliationFromYear: string;
		affiliationUntilYear: string;
	}[];

	orcidIDs: string[];

	viafIDs: string[];

	librisIDs: string[];

	biographyEnglish?: {
		biography: string;
		language: string;
	};

	biographySwedish?: {
		biography: string;
		language: string;
	};

	personDomainPart?: {
		personDomainPart: string;
	}[];

	constructor(id: string, authorisedName: Name) {
		this.id = id;
		this.authorisedName = authorisedName;
		this.alternativeNames = [];
		this.academicTitle = '';
		this.orcidIDs = [];
		this.viafIDs = [];
		this.librisIDs = [];
		this.externalURLs = [];
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
