import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import PersonView from '../../src/components/PersonView';

let valueToReturn = 'someId;';
jest.mock('react-router-dom', () => {
	return {
		useParams: jest.fn(() => {
			return { personId: valueToReturn };
		}),
	};
});

describe('The Person component', () => {
	it('Should take the personId from useParams and render it 1', () => {
		render(<PersonView />);
		expect(useParams).toBeCalledTimes(1);
		expect(screen.getByText(/Person: someId/i)).toBeInTheDocument();
	});

	it('Should take the personId from useParams and render it 2', () => {
		valueToReturn = 'someOtherId';
		render(<PersonView />);
		expect(useParams).toBeCalledTimes(1);
		expect(screen.getByText(/Person: someOtherId/i)).toBeInTheDocument();
	});
});
