class Name {
	familyName: string;

	givenName: string;

	constructor(familyName: string, givenName: string) {
		this.familyName = familyName;
		this.givenName = givenName;
	}

	toString = () => {
		return `${this.familyName}, ${this.givenName}`;
	};
}

export default Name;
