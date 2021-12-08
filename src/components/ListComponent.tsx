import React from 'react';
import Listable from '../control/Listable';
import List from '../styles/List';

type Props = {
	list: Listable[];
};

const ListComponent = function (props: Props) {
	const { list } = props;
	if (!list.length) {
		return <p>Ingen data</p>;
	}
	return (
		<List>
			{list.map((item) => (
				<li key={item.id} />
			))}
		</List>
	);
};

export default ListComponent;
