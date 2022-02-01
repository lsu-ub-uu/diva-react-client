import React from 'react';

const ListWithLabel = function ({
	list,
	label,
}: {
	list: string[];
	label: string;
}) {
	return (
		<div>
			{list.length && (
				<p>
					{label}:
					{list.map((id) => (
						<p key={id}>{id}</p>
					))}
				</p>
			)}
		</div>
	);
};

export default ListWithLabel;
