import React, { useState } from 'react';

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

	const [apiParams, setApiParams] = useState(initialApiParams);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [result, setResult] = useState<Result>({
		hasData: false,
		isError: false,
	});

	React.useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setResult({ hasData: false, isError: false });

			try {
				const response: T = await apiToCall(...Object.values(apiParams));
				setResult({ isError: false, hasData: true, data: response });
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				setResult({ hasData: false, isError: true, error: castError });
			}
			setIsLoading(false);
		};

		fetchData();
	}, [apiParams]);

	return { result, isLoading, setApiParams };
};

export default useApi;
