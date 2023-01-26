import React from 'react';
import { Button } from 'grommet';

const SearchButton = function () {
	return (
		<Button
			label='Sök'
			type='submit'
			id='searchButton'
			primary
		/>
	);
};

export default SearchButton;
