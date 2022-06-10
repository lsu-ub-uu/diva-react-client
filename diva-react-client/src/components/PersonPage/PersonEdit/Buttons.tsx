import React from 'react';
import { Button } from 'grommet';
import { Add, Trash } from 'grommet-icons';

export const TrashButton = React.memo(
	({
		onClick,
		plain = undefined,
	}: {
		onClick: () => void;
		// eslint-disable-next-line react/require-default-props
		plain?: boolean;
	}) => {
		return (
			<Button
				icon={<Trash />}
				label=""
				plain={plain}
				hoverIndicator
				onClick={onClick}
				data-testid="trashbutton"
			/>
		);
	}
);
export const AddButton = React.memo(
	({
		onClick,
		plain = undefined,
		label,
	}: {
		onClick: () => void;
		// eslint-disable-next-line react/require-default-props
		plain?: boolean;
		label: string;
	}) => {
		return (
			<Button
				data-testid={label}
				icon={<Add />}
				label={label}
				plain={plain}
				hoverIndicator
				onClick={onClick}
			/>
		);
	}
);
