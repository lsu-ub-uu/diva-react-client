import React from 'react';

type Response = {
	data: string;
	isLoading: boolean;
	isError: boolean;
};

const useDataApi = (
	initialUrl: string,
	initialData: string
): [response: Response, setUrl: Function] => {
	const isLoading = true;
	const isError = false;
	const data = initialData;
	const setUrl = () => {};
	return [{ data, isLoading, isError }, setUrl];
};

export default useDataApi;
