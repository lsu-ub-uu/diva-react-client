import React from 'react';
import { Box, Card } from 'grommet';
import { PersonAction, PersonActionType } from './personReducer';
import { FormPerson } from '../../../types/FormPerson';
import { MemoizedFormField } from './MemoizedFormField';
import { TrashButton, AddButton } from './Buttons';
import { validateWithRegex } from './PersonEdit';

export const StringArray = function ({
	stringArray,
	label,
	field,
	dispatchPerson,
}: {
	stringArray: string[];
	label: string;
	field: keyof FormPerson;
	dispatchPerson: (value: PersonAction) => void;
}) {
	return (
		<>
			{stringArray.map((value, index) => {
				return (
					<Card
						// eslint-disable-next-line react/no-array-index-key
						key={`libris-${index}`}
						direction="row"
						justify="between"
						align="center"
						margin={{ top: 'small', bottom: 'small' }}
						pad="small"
					>
						<MemoizedFormField
							name={`${field}-${index}`}
							label={label}
							value={value}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								dispatchPerson({
									type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
									payload: {
										field,
										index,
										value: event.target.value,
									},
								});
							}}
							validate={validateWithRegex(
								/(^[0-9]{2,10}$)|(^https:\/\/libris\.kb\.se\/[0-9A-Za-z.#]{2,50}$)/,
								`Ange ett giltigt Libris-ID`
							)}
						/>
						<TrashButton
							onClick={() => {
								dispatchPerson({
									type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
									payload: {
										field,
										index,
									},
								});
							}}
						/>
					</Card>
				);
			})}
			<Box direction="row" justify="start" margin={{ bottom: 'small' }}>
				<AddButton
					label={`Lägg till ${label}`}
					plain
					onClick={React.useCallback(() => {
						dispatchPerson({
							type: PersonActionType.ADD_ARRAY_STRING_FIELD,
							payload: {
								field,
							},
						});
					}, [field])}
				/>
			</Box>
		</>
	);
};

export default StringArray;
