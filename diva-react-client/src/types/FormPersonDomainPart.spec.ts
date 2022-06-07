import {
	completePersonDomainPart,
	minimalPersonDomainPart,
} from '../../testData/personDomainPartObjectData';
import { convertToFormPersonDomainPart } from './FormPersonDomainPart';

describe('FormPersonDomainPart', () => {
	it('converts a minimal PersonDomainPart', () => {
		const formPersonDomainPart = convertToFormPersonDomainPart(
			minimalPersonDomainPart
		);

		expect(formPersonDomainPart).toStrictEqual({
			id: 'someMinimalId',
			identifiers: [],
			domain: 'uu',
			affiliations: [],
		});
	});

	it('converts a complete personDomainPart', () => {
		const formPersonDomainPart = convertToFormPersonDomainPart(
			completePersonDomainPart
		);

		expect(formPersonDomainPart).toStrictEqual({
			id: 'someCompleteId',
			identifiers: ['someIdentifier'],
			domain: 'kth',
			affiliations: [
				{
					id: 'someAffiliationid',
					fromYear: '1990',
					untilYear: '2000',
				},
			],
		});
	});
});
