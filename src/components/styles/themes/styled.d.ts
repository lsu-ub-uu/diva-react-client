import 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		text: string;
		primary: string;
		primaryAccent: string;
		secondary: string;
		background: string;
	}
}
