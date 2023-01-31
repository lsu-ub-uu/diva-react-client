import React from 'react';
import { Grid, Select as SelectGrommet /* TextInput */ } from 'grommet';
import { Select as SearchSelect } from '../../styles/Select';

const Select = function ({
	id,
	value,
	onChange,
	options,
}: {
	id: string;

	value: string;
	onChange: any;
	options: string[];
}) {
	return (
		<Grid
			columns={['6.3em', 'max-content']}
			gap={{ column: 'small' }}
			align='center'
		>
			<SelectGrommet
				id={id}
				aria-labelledby='rows-label'
				value={value}
				onChange={onChange}
				options={options}
			/>
			<SearchSelect
				id={id}
				aria-labelledby='rows-label'
				value={value}
				onChange={onChange}
			>
				{options.map((option) => {
					return <option key={option}>{option}</option>;
				})}
			</SearchSelect>
			<span id='rows-label'>Träffar per sida</span>
		</Grid>
	);
};
export default Select;
