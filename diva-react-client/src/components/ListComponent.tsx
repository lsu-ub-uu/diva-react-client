import { List } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import CardList from './CardList';

function ListComponent({ list }: { list: List }) {
	return <CardList list={list.data} />;
}

export default ListComponent;
