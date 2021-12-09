import React from 'react';

const PersonView = function ({ id }: { id: string }) {
	return (
		<section>
			<span>Person: {id}</span>
		</section>
	);
};

export default PersonView;
