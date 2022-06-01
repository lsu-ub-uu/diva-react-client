import React from 'react';
import { Box, RadioButtonGroup, Text } from 'grommet';
import { PersonAction, PersonActionType } from './personReducer';

export const Public = React.memo(
	({
		publicValue,
		dispatchPerson,
	}: {
		publicValue: string;
		dispatchPerson: (value: PersonAction) => void;
	}) => {
		return (
			<Box align="start" pad={{ left: 'medium' }}>
				<Box margin={{ bottom: 'small' }}>
					<Text>Publik</Text>
				</Box>
				<RadioButtonGroup
					name="radio"
					options={[
						{ label: 'Ja', value: 'yes' },
						{ label: 'Nej', value: 'no' },
					]}
					value={publicValue}
					onChange={React.useCallback(() => {
						dispatchPerson({
							type: PersonActionType.TOGGLE_PUBLIC,
							payload: { field: 'public' },
						});
					}, [])}
				/>
			</Box>
		);
	}
);

export default Public;
