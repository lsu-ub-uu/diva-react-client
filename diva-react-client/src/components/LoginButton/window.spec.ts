import { window as importedWindow } from './window';

describe('window', () => {
	it('exports window', () => {
		expect(importedWindow).toStrictEqual(window);
	});
});
