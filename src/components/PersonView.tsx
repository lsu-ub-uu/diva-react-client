import React from 'react';
import { useParams } from 'react-router-dom';

const PersonView = function () {
	const { personId } = useParams();
	return (
		<section>
			<span>Person: {personId}</span>
		</section>
	);
};

export default PersonView;
