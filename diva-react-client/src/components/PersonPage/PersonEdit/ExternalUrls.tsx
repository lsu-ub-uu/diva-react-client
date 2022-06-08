import React from 'react';
import { Box, Card, CardHeader, Heading } from 'grommet';
import { ExternalUrl } from 'diva-cora-ts-api-wrapper';
import { PersonAction, PersonActionType } from './personReducer';
import { Repeatable } from '../../../types/Repeatable';
import { MemoizedTextField } from './MemoizedFormField';
import { TrashButton, AddButton } from './Buttons';
import { validateWithRegex } from './PersonEdit';

export const ExternalUrls = React.memo(
	({
		externalURLs,
		dispatchPerson,
	}: {
		externalURLs: Repeatable<ExternalUrl>[];
		dispatchPerson: (value: PersonAction) => void;
	}) => {
		return (
			<Box margin={{ top: 'large', bottom: 'large' }}>
				{externalURLs.map(({ content: externalURL, repeatId }) => {
					return (
						<Card
							// eslint-disable-next-line react/no-array-index-key
							key={repeatId}
							margin={{ top: 'small', bottom: 'small' }}
							pad="small"
						>
							<CardHeader pad="small">
								<Heading margin="none" level="6">
									Extern url
								</Heading>
							</CardHeader>
							<Box direction="row" justify="between">
								<MemoizedTextField
									label="Länktext"
									name={`externalURLs[${repeatId}].linkTitle`}
									value={externalURL.linkTitle}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										dispatchPerson({
											type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
											payload: {
												field: 'externalURLs',
												childField: 'linkTitle',
												value: event.target.value,
												index: repeatId,
											},
										});
									}}
									required
								/>
								<MemoizedTextField
									label="URL"
									name={`externalURLs[${repeatId}].URL`}
									value={externalURL.URL}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										dispatchPerson({
											type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
											payload: {
												field: 'externalURLs',
												childField: 'URL',
												value: event.target.value,
												index: repeatId,
											},
										});
									}}
									required
									validate={validateWithRegex(
										/(?=^.{3,255}$)^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{1,240}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
										`Ange en giltig URL.`
									)}
								/>
								<TrashButton
									onClick={() => {
										dispatchPerson({
											type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
											payload: {
												field: 'externalURLs',
												index: repeatId,
											},
										});
									}}
								/>
							</Box>
						</Card>
					);
				})}

				<Box direction="row" justify="start" margin={{ top: 'small' }}>
					<AddButton
						label="Lägg till extern URL"
						onClick={React.useCallback(() => {
							dispatchPerson({
								type: PersonActionType.ADD_ARRAY_OBJECT,
								payload: {
									field: 'externalURLs',
									emptyObject: { linkTitle: '', URL: '' },
								},
							});
						}, [])}
					/>
				</Box>
			</Box>
		);
	}
);

export default ExternalUrls;
