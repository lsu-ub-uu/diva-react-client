import React, { FunctionComponent } from 'react';

type Props = {
	darkMode: boolean;
	handleClick: () => void;
};

export const ModeSwitcher: FunctionComponent<Props> = function (props: Props) {
	const { darkMode, handleClick } = props;

	return (
		<button type="submit" onClick={handleClick}>
			{darkMode ? 'light' : 'dark'}
		</button>
	);
};

export default ModeSwitcher;
