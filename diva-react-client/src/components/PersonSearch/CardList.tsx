import { Record } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import List from '../../styles/List';
import Card from './Card';

type Props = {
	list: Record[];
	fromNumber: number;
};

const CardList = React.memo((props: Props) => {
	const { list, fromNumber } = props;
	if (!list.length) {
		return <p>Inga träffar matchade sökningen.</p>;
	}
	return (
		<List>
			{list.map((item, index) => (
				<li key={item.id}>
					<Card
						item={item}
						listItemNumber={index + fromNumber}
					/>
				</li>
			))}
		</List>
	);
});

export default CardList;
