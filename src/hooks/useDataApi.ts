import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type Response = {
	data: Object;
	isLoading: boolean;
	error: Error | null;
};

const useDataApi = (
	initialUrl: string,
	initialData: Object
): [response: Response, setUrl: Function] => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState(initialData);
	const [error, setError] = useState<Error | null>(null);
	const [url, setUrl] = useState<string>(initialUrl);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			if (url) {
				try {
					const result: AxiosResponse = await axios.get(url);
					setData(result.data);
				} catch (unknownError: unknown) {
					const axiosError: AxiosError = <AxiosError>unknownError;
					if (axiosError.response) {
						setError(new Error(axiosError.response.data));
					} else if (axiosError.request) {
						setError(
							new Error('The request was made but no response was received.')
						);
					} else {
						setError(new Error(axiosError.message));
					}
				}
				setIsLoading(false);
			}
		};
		fetchData();
	}, [url]);

	return [{ data, isLoading, error }, setUrl];
};

export default useDataApi;
