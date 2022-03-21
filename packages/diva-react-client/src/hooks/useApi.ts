import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useApi = <T>(
	apiToCall: (...args: any) => Promise<T>,
	initialApiParams: any
) => {
	type Result = {
		hasData: boolean;
		isError: boolean;
		data?: T;
		error?: Error;
	};

	const { auth } = useAuth();

	const [apiParams, setApiParams] = useState(initialApiParams);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [result, setResult] = useState<Result>({
		hasData: false,
		isError: false,
	});

	React.useEffect(() => {
		const parameters = Object.values(apiParams);
		if (auth.token !== '') {
			parameters.push(auth.token);
		}

		const fetchData = async () => {
			setIsLoading(true);
			setResult({ hasData: false, isError: false });

			try {
				const response: T = await apiToCall(...parameters);
				setResult({ isError: false, hasData: true, data: response });
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				setResult({ hasData: false, isError: true, error: castError });
			}
			setIsLoading(false);
		};

		if (Object.values(apiParams).length > 0) {
			fetchData();
		}
	}, [apiParams, auth]);

	return { result, isLoading, setApiParams };
};

export default useApi;
