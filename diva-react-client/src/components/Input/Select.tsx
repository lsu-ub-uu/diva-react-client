import React from 'react';
import { Select as SearchSelect } from '../../styles/Select';

const Select = function ({
	id,
	value,
	onChange,
	options,
	labelText,
}: {
	id: string;
	value: string;
	onChange: any;
	options: string[];
	labelText: string;
}) {
	return (
		<>
			{/* <Grid
				columns={['6.3em', 'max-content']}
				gap={{ column: 'small' }}
				align='center'
			> */}
			{/* 			<SelectGrommet
				id={id}
				aria-labelledby='rows-label'
				value={value}
				onChange={onChange}
				options={options}
			/> 
			aaaaaa
			
			*/}
			<SearchSelect
				name={id}
				id={id}
				aria-labelledby={id}
				value={value}
				onChange={onChange}
			>
				{options.map((option) => {
					return <option key={option}>{option}</option>;
				})}
			</SearchSelect>
			<label htmlFor={id}>{labelText}</label>

			{/* </Grid> */}
		</>
	);
};
export default Select;
