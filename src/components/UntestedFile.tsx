import React from 'react';
import Listable from '../cora/types/Listable';
import List from '../styles/List';
import Card from './Card';

type Props = {
	list: Listable[];
};

const CardList = React.memo((props: Props) => {
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

export default CardList;
