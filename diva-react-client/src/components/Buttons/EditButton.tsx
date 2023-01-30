import { Box, Button } from 'grommet';
import { Edit } from 'grommet-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';

const EditButton = function ({
	recordType,
	id,
}: {
	recordType: string;
	id: string;
}) {
	const { auth } = useAuth();

	if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
		return null;
	}

	return (
		<Box margin={{ top: '0.5em' }}>
			<Link
				to={`/${recordType}/edit/${id}`}
				style={{ justifySelf: 'start' }}
			>
				<Button
					icon={<Edit />}
					a11yTitle='Editera'
				/>
			</Link>
		</Box>
	);
};

export default EditButton;
