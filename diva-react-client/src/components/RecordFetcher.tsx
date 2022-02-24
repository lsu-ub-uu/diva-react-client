import React from 'react';
import { getRecordById } from '../cora/api/api';
import { RecordType } from '../cora/types/Record';
import useApi from '../hooks/useApi';

type InjectedRecordProp<T> = {
	record: T;
};

const RecordFetcher = function <T>({
	recordType,
	id,
	children,
}: {
	recordType: RecordType;
	id: string;
	children(props: InjectedRecordProp<T>): JSX.Element;
}) {
	const { isLoading, result } = useApi<T>(getRecordById, { recordType, id });

	return (
		<section>
			{result.error && (
				<p data-testid="errorMessage">
					Någonting gick fel: {result.error.message}
				</p>
			)}
			{isLoading && <p>Hämtar data...</p>}
			{result.data && children({ record: result.data })}
		</section>
	);
};

export default RecordFetcher;
