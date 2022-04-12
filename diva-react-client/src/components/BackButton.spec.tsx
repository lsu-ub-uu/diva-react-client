import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import BackButton from './BackButton';

jest.mock('react-router', () => ({
	Router: jest.fn(() => null),
}));

describe('BackButton.spec', () => {
	it('It renders button "Tillbaka"', () => {});
});
