import React from 'react';
import { Box, Card, CardHeader } from 'grommet';
import { PersonAction, PersonActionType } from './personReducer';
import { FormAffiliation } from '../../../types/FormPerson';
import { validateWithRegex, INVALID_YEAR_MESSAGE } from './PersonEdit';
import { MemoizedFormField } from './MemoizedFormField';

export const OtherOrganisation = React.memo(
	({
		otherAffiliation,
		dispatchPerson,
	}: {
		otherAffiliation: FormAffiliation;
		dispatchPerson: (value: PersonAction) => void;
	}) => {
		return (
			<Card
				margin={{ top: 'small', bottom: 'small' }}
				pad="small"
				key="otherOrganisation"
			>
				<CardHeader pad="small">Annan organisation</CardHeader>
				<Box direction="row" justify="between">
					<MemoizedFormField
						label="Namn"
						name="otherAffiliation-name"
						value={otherAffiliation.name}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_OBJECT,
									payload: {
										field: 'otherAffiliation',
										childField: 'name',
										value: event.target.value,
									},
								});
							},
							[]
						)}
						validate={validateWithRegex(/^[0-9]{4}$/, INVALID_YEAR_MESSAGE)}
					/>
				</Box>
				<Box direction="row" justify="between">
					<MemoizedFormField
						label="Från"
						name="otherAffiliation-from"
						value={otherAffiliation.fromYear}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_OBJECT,
									payload: {
										field: 'otherAffiliation',
										childField: 'fromYear',
										value: event.target.value,
									},
								});
							},
							[]
						)}
						validate={validateWithRegex(/^[0-9]{4}$/, INVALID_YEAR_MESSAGE)}
					/>
					<MemoizedFormField
						name="otherAffiliation-until"
						label="Till"
						value={otherAffiliation.untilYear}
						validate={validateWithRegex(/^[0-9]{4}$/, INVALID_YEAR_MESSAGE)}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_OBJECT,
									payload: {
										field: 'otherAffiliation',
										childField: 'untilYear',
										value: event.target.value,
									},
								});
							},
							[]
						)}
					/>
				</Box>
			</Card>
		);
	}
);

export default OtherOrganisation;
