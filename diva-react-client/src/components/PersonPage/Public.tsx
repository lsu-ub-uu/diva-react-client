import { Heading } from 'grommet';
import React from 'react';
import { BinaryString } from '../../types/FormPerson';

const Public = function ({ isPublic }: { isPublic: BinaryString }) {
	return (
		<>
			<Heading level={4}>Publik</Heading>
			<p>{translateBinaryString(isPublic)}</p>
		</>
	);
};

const translateBinaryString = (isPublic: BinaryString) => {
	if (isPublic === 'yes') {
		return 'Ja';
	}
	return 'Nej';
};

export default Public;
