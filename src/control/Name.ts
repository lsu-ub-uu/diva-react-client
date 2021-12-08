class Name {
	familyName: string;

	givenName: string;

	constructor(familyName: string, givenName: string) {
		this.familyName = familyName;
		this.givenName = givenName;
	}

	toString = () => {
		const names = [this.familyName, this.givenName];
		return names.filter((name) => name !== '').join(', ');
	};
}

export default Name;
