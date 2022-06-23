import { Heading, Paragraph } from 'grommet';
import React from 'react';

export const Biography = function ({
	label,
	text,
}: {
	label: string;
	text: string;
}) {
	return (
		<>
			<Heading level={4}>{label}</Heading>
			<Paragraph>{text}</Paragraph>
		</>
	);
};

export default Biography;
