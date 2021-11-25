import Name from './Name';

interface Person {
	id: string;
	authorisedName: Name;
	domains?: string[];
}

export default Person;
