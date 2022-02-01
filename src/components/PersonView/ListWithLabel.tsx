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
				<>
					<b>{label}:</b>
					<ul>
						{list.map((id) => (
							<li key={id}>{id}</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
};

export default ListWithLabel;
