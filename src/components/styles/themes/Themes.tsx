import { DefaultTheme } from 'styled-components';

export enum AvailableThemes {
	// eslint-disable-next-line no-unused-vars
	Light = 'light',
	// eslint-disable-next-line no-unused-vars
	Dark = 'dark',
}

const lightTheme: DefaultTheme = {
	name: AvailableThemes.Light,
	primary: '#75598e',
	primaryAccent: '#9c77bd',
	secondary: 'white',
	text: 'black',
	background: 'white',
};

const darkTheme: DefaultTheme = {
	name: AvailableThemes.Dark,
	primary: '#0057a8',
	primaryAccent: '#cfcfce',
	secondary: '#ffffff',
	text: '#ffffff',
	background: '#001931',
};

export default { lightTheme, darkTheme };
