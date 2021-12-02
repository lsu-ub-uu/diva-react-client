import Themes, { AvailableThemes } from '../../src/themes/Themes';

describe('The Themes module', () => {
	it('contains a light theme', () => {
		expect(Themes.lightTheme).toBeDefined();
		expect(Themes.lightTheme.name).toStrictEqual(AvailableThemes.Light);
	});

	it('contains a dark theme', () => {
		expect(Themes.darkTheme).toBeDefined();
		expect(Themes.darkTheme.name).toStrictEqual(AvailableThemes.Dark);
	});
});
