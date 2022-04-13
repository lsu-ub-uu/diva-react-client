import { Affiliation, PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import { Box, Button, FormField, Text } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import React from 'react';
import useForm from './useForm';

const PersonDomainPartEdit = function ({
	personDomainPart: originalPersonDomainPart,
}: {
	personDomainPart: PersonDomainPart;
}) {
	const {
		inputs: personDomainPart,
		setInputs,
		handleChange,
	} = useForm(originalPersonDomainPart);

	const removeAffiliation = (index: number) => {
		if (
			personDomainPart.affiliations &&
			personDomainPart.affiliations.length > 0
		) {
			setInputs({
				...personDomainPart,
				affiliations: personDomainPart.affiliations.filter(
					(v, _idx) => _idx !== index
				),
			});
		}
	};
	const addAffiliation = () => {
		const newArray: Affiliation[] = [];
		if (
			personDomainPart.affiliations &&
			personDomainPart.affiliations.length > 0
		) {
			newArray.push(...personDomainPart.affiliations);
		}
		newArray.push({ name: '', fromYear: '', untilYear: '' });
		setInputs({
			...personDomainPart,
			affiliations: newArray,
		});
	};

	let AffiliationGroup = null;
	const updateAlternativeNameGroup = () => {
		if (personDomainPart.affiliations !== undefined) {
			AffiliationGroup = personDomainPart.affiliations.map(
				(affiliation, index) => {
					return (
						<Box>
							<Box
								key={index}
								direction="row-responsive"
								justify="between"
								align="center"
							>
								<FormField
									label="Namn"
									name={`affiliations[${index}].name`}
									value={affiliation.name}
									onChange={handleChange}
									required
								/>
								<FormField
									label="Från"
									name={`affiliations[${index}].fromYear`}
									value={affiliation.fromYear}
									onChange={handleChange}
									required
								/>
							</Box>
							<Box align="end" justify="center">
								<Button
									icon={<Trash />}
									label="Ta bort"
									plain
									hoverIndicator
									onClick={() => removeAffiliation(index)}
								/>
							</Box>
						</Box>
					);
				}
			);
		}
	};
	updateAlternativeNameGroup();

	return (
		<Box>
			<Text>{originalPersonDomainPart.domain}</Text>
			{AffiliationGroup}
			<Button
				icon={<Add />}
				label="Lägg till alternativt namn"
				plain
				hoverIndicator
				onClick={addAffiliation}
			/>
		</Box>
	);
};

export default PersonDomainPartEdit;
