import {
	ExtendedPersonReturnType,
	getPersonById,
} from 'diva-cora-ts-api-wrapper';
import React from 'react';
import useApi from '../../hooks/useApi';

type InjectedRecordProp<T> = {
	record: T;
};

const PersonFetcher = function ({
	id,
	children,
}: {
	id: string;
	children(props: InjectedRecordProp<ExtendedPersonReturnType>): JSX.Element;
}) {
	const { isLoading, result } = useApi<ExtendedPersonReturnType>(
		getPersonById,
		{
			id,
		}
	);

	return (
		<section>
			{result.error && (
				<p data-testid='errorMessage'>
					Någonting gick fel: {result.error.message}
				</p>
			)}
			{isLoading && <p>Hämtar data...</p>}
			{result.data && children({ record: result.data })}
		</section>
	);
};

export default PersonFetcher;
