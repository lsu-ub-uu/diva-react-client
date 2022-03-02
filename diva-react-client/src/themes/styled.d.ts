import 'styled-components';
import { AvailableThemes } from './Themes';

declare module 'styled-components' {
	export interface DefaultTheme {
		name: AvailableThemes;
		text: string;
		primary: string;
		primaryAccent: string;
		secondary: string;
		grey: string;
		background: string;
		boxShadow: string;
		boxShadowAccent: string;
		borderRadius: string;
		fontSizeBig: string;
		fontSizeSmall: string;
		fontWeightBig: string;
	}
}
