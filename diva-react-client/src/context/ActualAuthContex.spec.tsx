import React from 'react';
import { render, screen } from '@testing-library/react';
import ActualAuthContext from './ActualAuthContext';

describe('ActualAuthContex.spec', () => {
	describe('ActualAuthContext', () => {
		it('exists', () => {
			const spy = jest.spyOn(React, 'createContext');

			const SomeComponent = function () {
				React.useContext(ActualAuthContext);

				return <div />;
			};

			render(<SomeComponent />);

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});
});
