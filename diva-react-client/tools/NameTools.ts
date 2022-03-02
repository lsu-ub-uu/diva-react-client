import { Name } from 'diva-cora-ts-api-wrapper';

export const getDisplayName = (name: Name) => {
	if (name.familyName === '') {
		return name.givenName;
	}
	if (name.givenName === '') {
		return name.familyName;
	}
	return `${name.familyName}, ${name.givenName}`;
};

export default { getDisplayName };
