import React from 'react';
import { render, screen } from '@testing-library/react';
import OtherAffiliation from './OtherAffiliation';
import AffiliationDisplay from './AffiliationDisplay';

jest.mock('./AffiliationDisplay', () => {
	return jest.fn(() => {
		return <div />;
	});
});

describe('OtherAffiliation', () => {
	it('Takes an affiliation', () => {
		render(
			<OtherAffiliation
				affiliation={{
					name: 'someAffiliation',
					fromYear: '1000',
					untilYear: '2000',
				}}
			/>
		);
	});

	it('Renders heading', () => {
		render(
			<OtherAffiliation
				affiliation={{
					name: 'someAffiliation',
					fromYear: '1000',
					untilYear: '2000',
				}}
			/>
		);

		expect(
			screen.getByRole('heading', {
				name: 'Andra organisationer (utanför DiVA)',
			})
		).toBeInTheDocument();
	});

	it('Calls AffiliationDisplay with affiliation', () => {
		const affiliation = {
			name: 'someAffiliation',
			fromYear: '1000',
			untilYear: '2000',
		};
		const { rerender } = render(<OtherAffiliation affiliation={affiliation} />);

		expect(AffiliationDisplay).toHaveBeenCalledTimes(1);
		expect(AffiliationDisplay).toHaveBeenLastCalledWith(
			expect.objectContaining({
				affiliation,
			}),
			expect.any(Object)
		);

		const otherAffiliation = {
			name: 'someOtherAffiliation',
			fromYear: '2000',
			untilYear: '2030',
		};
		rerender(<OtherAffiliation affiliation={otherAffiliation} />);
		expect(AffiliationDisplay).toHaveBeenCalledTimes(2);
		expect(AffiliationDisplay).toHaveBeenLastCalledWith(
			expect.objectContaining({
				affiliation: otherAffiliation,
			}),
			expect.any(Object)
		);
	});

	it('If all fields are empty, do not call AffiliationDisplay', () => {
		const affiliation = {
			name: '',
			fromYear: '',
			untilYear: '',
		};
		render(<OtherAffiliation affiliation={affiliation} />);

		expect(AffiliationDisplay).not.toHaveBeenCalled();
	});

	it('If all fields are empty, do not print heading', () => {
		const affiliation = {
			name: '',
			fromYear: '',
			untilYear: '',
		};
		render(<OtherAffiliation affiliation={affiliation} />);

		expect(
			screen.queryByRole('heading', {
				name: 'Andra organisationer (utanför DiVA)',
			})
		).not.toBeInTheDocument();
	});
});
