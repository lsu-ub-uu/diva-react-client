import { useEffect, useState } from 'react';
import { getPersonById } from '../control/api';
import Person from '../control/Person';

const useGetPersonById = (
	id: string
): { person?: Person; isLoading: boolean; error?: Error } => {
	const [person, setPerson] = useState<Person>();
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
