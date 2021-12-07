import React from 'react';
import Button from '../styles/Button';

type Props = {
	darkMode: boolean;
	handleClick: () => void;
};

export const ModeSwitcher = function (props: Props) {
	const { darkMode, handleClick } = props;
	return (
		<Button type="submit" onClick={handleClick}>
			{darkMode ? 'light' : 'dark'}
		</Button>
	);
};

export default ModeSwitcher;
