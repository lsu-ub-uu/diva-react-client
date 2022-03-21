import React from 'react';
import { render, screen } from '@testing-library/react';
import { Affiliation } from 'diva-cora-ts-api-wrapper';
import AffiliationDisplay from './AffiliationDisplay';

const ComponentToTest = AffiliationDisplay;

const affiliationWithName: Affiliation = {
	name: 'someAffiliation',
};

const affiliationWithFromAndUntilYear: Affiliation = {
	name: 'someAffiliationWithFromAndUntilYear',
	fromYear: '2000',
	untilYear: '2001',
};

describe('AffiliationDisplay', () => {
	it('Takes an affiliation', () => {
		render(<ComponentToTest affiliation={{ name: 'someAffiliation' }} />);
	});

	it('should display affiliation if it is set', () => {
		const { rerender } = render(
			<ComponentToTest affiliation={affiliationWithName} />
		);

		expect(screen.getByText(/someAffiliation/)).toBeInTheDocument();

		const affiliation2: Affiliation = {
			name: 'SomeDifferentAffiliation',
		};
		rerender(<ComponentToTest affiliation={affiliation2} />);

		expect(screen.queryByText(/someAffiliation/)).not.toBeInTheDocument();

		expect(screen.getByText(/SomeDifferentAffiliation/)).toBeInTheDocument();
	});

	it('should display affiliation years if they are set', () => {
		const { rerender } = render(
			<ComponentToTest affiliation={affiliationWithFromAndUntilYear} />
		);

		expect(screen.getByText(/ \(2000 - 2001\)/)).toBeInTheDocument();

		const affiliation2: Affiliation = {
			name: 'SomeDifferentAffiliation',
			fromYear: '3000',
			untilYear: '4000',
		};
		rerender(<ComponentToTest affiliation={affiliation2} />);

		expect(screen.queryByText(/ \(2000 - 2001\)/)).not.toBeInTheDocument();

		expect(screen.getByText(/ \(3000 - 4000\)/)).toBeInTheDocument();
	});

	it('should not display affiliationYears if they are not set', () => {
		const affiliation: Affiliation = {
			name: 'SomeAffiliation',
		};
		const { rerender } = render(<ComponentToTest affiliation={affiliation} />);

		expect(screen.queryByText(/ \( - \)/)).not.toBeInTheDocument();

		const affiliation2: Affiliation = {
			name: 'SomeDifferentAffiliation',
		};
		rerender(<ComponentToTest affiliation={affiliation2} />);

		expect(screen.queryByText(/ \( - \)/)).not.toBeInTheDocument();
	});

	it('should display fromYear if it is set', () => {
		const affiliation: Affiliation = {
			name: 'SomeAffiliation',
			fromYear: '1999',
		};
		const { rerender } = render(<ComponentToTest affiliation={affiliation} />);

		expect(screen.getByText(/ \(1999 - \)/)).toBeInTheDocument();

		const affiliation2: Affiliation = {
			name: 'SomeAffiliation',
			fromYear: '1234',
		};
		rerender(<ComponentToTest affiliation={affiliation2} />);

		expect(screen.getByText(/ \(1234 - \)/)).toBeInTheDocument();
	});

	it('should display untilYear if it is set', () => {
		const affiliation: Affiliation = {
			name: 'SomeAffiliation',
			untilYear: '1999',
		};
		const { rerender } = render(<ComponentToTest affiliation={affiliation} />);

		expect(screen.getByText(/ \( - 1999\)/)).toBeInTheDocument();

		const affiliation2: Affiliation = {
			name: 'SomeAffiliation',
			untilYear: '1234',
		};
		rerender(<ComponentToTest affiliation={affiliation2} />);

		expect(screen.getByText(/ \( - 1234\)/)).toBeInTheDocument();
	});
});
