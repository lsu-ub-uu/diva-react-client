import React from 'react';
import Listable from '../control/Listable';
import List from '../styles/List';
import Card from './Card';

type Props = {
	list: Listable[];
};

const ListComponent = React.memo((props: Props) => {
	const { list } = props;
	if (!list.length) {
		return <p>Inga träffar matchade sökningen.</p>;
	}
	return (
		<List>
			{list.map((item) => (
				<li key={item.id}>
					<Card item={item} />
				</li>
			))}
		</List>
	);
});

export default ListComponent;
