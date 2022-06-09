import React from 'react';
import { Box, Card, CardHeader, Heading } from 'grommet';
import { Name } from 'diva-cora-ts-api-wrapper';
import { PersonAction, PersonActionType } from './personReducer';
import { Repeatable } from '../../../types/Repeatable';
import { MemoizedTextField } from './MemoizedFormField';
import { TrashButton, AddButton } from './Buttons';

export const AlternativeNames = React.memo(
	({
		alternativeNames,
		dispatchPerson,
	}: {
		alternativeNames: Repeatable<Name>[];
		dispatchPerson: (value: PersonAction) => void;
	}) => {
		return (
			<>
				{alternativeNames.map((repeatable) => (
					<AlternativeNameForm
						key={repeatable.repeatId}
						repeatable={repeatable}
						dispatchPerson={dispatchPerson}
					/>
				))}
				<AddButton
					label="Lägg till alternativt namn"
					plain
					data-testid="addAltName"
					onClick={React.useCallback(() => {
						dispatchPerson({
							type: PersonActionType.ADD_ARRAY_OBJECT,
							payload: {
								field: 'alternativeNames',
								emptyObject: { familyName: '', givenName: '' },
							},
						});
					}, [])}
				/>
			</>
		);
	}
);

const AlternativeNameForm = React.memo(
	({
		repeatable: { repeatId, content: alternativeName },
		dispatchPerson,
	}: {
		repeatable: Repeatable<Name>;
		dispatchPerson: (value: PersonAction) => void;
	}) => {
		return (
			<Card
				// eslint-disable-next-line react/no-array-index-key
				key={repeatId}
				margin={{ top: 'small', bottom: 'small' }}
				pad="small"
			>
				<CardHeader pad="small">
					<Heading margin="none" level="6">
						Alternativt namn
					</Heading>
				</CardHeader>

				<Box direction="row" justify="between">
					<MemoizedTextField
						label="Efternamn"
						name={alternativeName.familyName}
						value={alternativeName.familyName}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
									payload: {
										field: 'alternativeNames',
										childField: 'familyName',
										value: event.target.value,
										index: repeatId,
									},
								});
							},
							[repeatId]
						)}
						required
					/>
					<MemoizedTextField
						label="Förnamn"
						name={alternativeName.givenName}
						value={alternativeName.givenName}
						onChange={React.useCallback(
							(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
									payload: {
										field: 'alternativeNames',
										childField: 'givenName',
										value: event.target.value,
										index: repeatId,
									},
								});
							},
							[repeatId]
						)}
					/>

					<TrashButton
						onClick={() => {
							dispatchPerson({
								type: PersonActionType.DELETE_ARRAY_WITH_ID,
								payload: {
									field: 'alternativeNames',
									repeatId,
								},
							});
						}}
					/>
				</Box>
			</Card>
		);
	}
);

export default AlternativeNames;
