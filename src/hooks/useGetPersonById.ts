import { useEffect, useState } from 'react';
import { getPersonById } from '../control/api';
import { PersonObject } from '../converter/Person/PersonDefinitions';

const useGetPersonById = (
	id: string
): { person?: PersonObject; isLoading: boolean; error?: Error } => {
	const [person, setPerson] = useState<PersonObject>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	useEffect(() => {
		if (id === '') {
			setError(new Error('No personId was provided'));
			setIsLoading(false);
		} else {
			getPersonById(id)
				.then((result) => {
					setIsLoading(false);
					setPerson(result);
				})
				.catch((errorFromPersonById) => {
					setError(errorFromPersonById);
					setIsLoading(false);
				});
		}
	}, []);

	return { person, isLoading, error };
};

export default useGetPersonById;
