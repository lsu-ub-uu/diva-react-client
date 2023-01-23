import {
	Box,
	Card as GrommetCard,
	CardBody,
	CardFooter,
	CardHeader,
	Grid,
	Tag,
} from 'grommet';
import React from 'react';
import { Link } from 'react-router-dom';
import { Person, Record, RecordType } from 'diva-cora-ts-api-wrapper';
import ListWithLabel from '../PersonPage/ListWithLabel';
import getDomainCollection from '../../divaData/resources';
import { getDisplayName } from '../../../tools/NameTools';

const Card = function ({
	item,
	listItemNumber,
}: {
	item: Record;
	listItemNumber: number;
}) {
	return (
		<GrommetCard>
			<CardHeader
				pad='small'
				justify='start'
				gap='xsmall'
			>
				<Grid
					width='100%'
					gap={{ column: '0.4em' }}
					columns={['min-content', 'auto', 'max-content']}
					rows={['min-content']}
					areas={[
						{ name: 'listItemNumber', start: [0, 0], end: [0, 0] },
						{ name: 'title', start: [1, 0], end: [1, 0] },
						{ name: 'id', start: [2, 0], end: [2, 0] },
					]}
				>
					<Box>{listItemNumber}.</Box>
					<Link
						className='headingLink'
						to={`/${item.recordType}/${item.id}`}
					>
						{getPresentation(item)}
					</Link>
					<div style={{ justifySelf: 'right', gridArea: 'id' }}>
						{item.id}
					</div>
				</Grid>
			</CardHeader>
			{possiblyShowOrcid(item)}
			<CardFooter pad='small'>{possiblyShowDomains(item)}</CardFooter>
		</GrommetCard>
	);
};

const getPresentation = (item: Record) => {
	if (isPerson(item)) {
		const person: Person = item as Person;
		if (person.authorisedName === undefined) {
			return person.id;
		}
		return getDisplayName(person.authorisedName);
	}

	return `${item.recordType}: ${item.id}`;
};

const possiblyShowOrcid = (item: Record) => {
	if (isPerson(item)) {
		const person = item as Person;
		if (person.orcids && person.orcids.length > 0) {
			const orcids = person.orcids.filter((orcid) => {
				return orcid !== '';
			});
			if (orcids.length > 0) {
				return (
					<CardBody
						pad={{ right: 'small' }}
						direction='row-reverse'
					>
						<ListWithLabel
							list={person.orcids}
							label=''
							omitEmptyStrings
						/>
					</CardBody>
				);
			}
		}
	}
	return null;
};

const possiblyShowDomains = (item: Record) => {
	if (isPerson(item)) {
		const person = item as Person;
		if (person.domains !== undefined && person.domains.length > 0) {
			const domainCollection = getDomainCollection();
			const domainNames = person.domains.map((domain) => {
				return domainCollection.get(domain) || domain;
			});

			return (
				<Box
					direction='row'
					wrap
					gap='0.5em'
				>
					{domainNames.map((name) => {
						return (
							<Tag
								value={name}
								key={name}
								size='small'
							/>
						);
					})}
				</Box>
			);
		}
	}

	return null;
};

const isPerson = (item: Record) => {
	return item.recordType === RecordType.Person;
};

export default Card;
