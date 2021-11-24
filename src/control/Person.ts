import Name from './Name';

interface Person {
	id: string;
	authorizedName: Name;
	domains?: string[];
}

export default Person;
