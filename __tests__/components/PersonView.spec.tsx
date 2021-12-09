import { render, screen } from '@testing-library/react';
import React from 'react';
import { useParams as actualUseParams } from 'react-router-dom';
import PersonView from '../../src/components/PersonView';

jest.mock('react-router-dom');
const useParams = actualUseParams as jest.MockedFunction<
	typeof actualUseParams
>;
useParams.mockReturnValue({ personId: 'someId' });

describe('The Person component', () => {
	it('Should take the personId from useParams and render it 1', () => {
		render(<PersonView />);
		expect(useParams).toBeCalledTimes(1);
		expect(screen.getByText(/Person: someId/i)).toBeInTheDocument();
	});

	it('Should take the personId from useParams and render it 2', () => {
		useParams.mockReturnValueOnce({ personId: 'someOtherId' });
		render(<PersonView />);
		expect(useParams).toBeCalledTimes(1);
		expect(screen.getByText(/Person: someOtherId/i)).toBeInTheDocument();
	});
});
