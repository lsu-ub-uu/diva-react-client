import axios from 'axios';
import React from 'react';

type Response = {
	data: Object;
	isLoading: boolean;
	isError: boolean;
};

const useDataApi = (
	initialUrl: string,
	initialData: Object
): [response: Response, setUrl: Function] => {
	let isLoading = true;
	const isError = false;
	let data = initialData;
	const setUrl = () => {};

	if (initialUrl) {
		axios(initialUrl);
		data = { data: 'someData' };
		isLoading = false;
	}

	return [{ data, isLoading, isError }, setUrl];
};

export default useDataApi;
