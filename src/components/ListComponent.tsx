import React from 'react';
import List from '../control/List';
import CardList from './CardList';

function ListComponent({ list }: { list: List }) {
	return <CardList list={list.data} />;
}

export default ListComponent;
