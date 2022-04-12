import { useNavigate } from 'react-router-dom';
import { Button, Box } from 'grommet';
import { Previous } from 'grommet-icons';
import React from 'react';

const BackButton = function () {
	const navigate = useNavigate();

	return (
		<Box align="start">
			<Button
				label="Tillbaka"
				type="submit"
				onClick={() => navigate(-1)}
				plain
				icon={<Previous />}
			/>
		</Box>
	);
};

export default BackButton;
