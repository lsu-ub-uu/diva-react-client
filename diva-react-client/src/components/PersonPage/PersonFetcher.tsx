import { getPersonById, Person, RecordType } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import useApi from '../../hooks/useApi';

type InjectedRecordProp<T> = {
	record: T;
};

const PersonFetcher = function ({
	recordType,
	id,
	children,
}: {
	recordType: RecordType;
	id: string;
	children(props: InjectedRecordProp<Person>): JSX.Element;
}) {
	const { isLoading, result } = useApi<Person>(getPersonById, {
		id,
	});

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

export default PersonFetcher;
