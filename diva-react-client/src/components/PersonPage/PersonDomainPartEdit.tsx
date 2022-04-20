import { AffiliationLink, PersonDomainPart } from 'diva-cora-ts-api-wrapper';
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

	const removeAffiliation = React.useCallback(
		(index: number) => {
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
		},
		[personDomainPart]
	);
	const addAffiliation = React.useCallback(() => {
		console.log('foo');
		const newArray: AffiliationLink[] = [];
		if (
			personDomainPart.affiliations &&
			personDomainPart.affiliations.length > 0
		) {
			newArray.push(...personDomainPart.affiliations);
		}
		newArray.push({ id: '', fromYear: '', untilYear: '' });
		setInputs({
			...personDomainPart,
			affiliations: newArray,
		});
	}, [personDomainPart]);

	let AffiliationGroup = null;
	const updateAlternativeNameGroup = () => {
		console.log('running updatealternativenamegroup');
		console.log(personDomainPart.affiliations);

		if (personDomainPart.affiliations !== undefined) {
			return personDomainPart.affiliations.map((affiliation, index) => {
				return (
					<Box>
						<Box
							key={affiliation.id}
							direction="row-responsive"
							justify="between"
							align="center"
						>
							<FormField
								label="Från"
								name={`affiliations[${index}].fromYear`}
								value={affiliation.fromYear}
								onChange={handleChange}
								required
							/>
							<FormField
								label="till"
								name={`affiliations[${index}].untilYear`}
								value={affiliation.untilYear}
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
			});
		}

		return null;
	};

	// React.useEffect(() => {
	// 	updateAlternativeNameGroup();
	// }, [personDomainPart]);

	return (
		<Box>
			<Text>{originalPersonDomainPart.domain}</Text>
			{updateAlternativeNameGroup()}
			<Button
				icon={<Add />}
				label="Lägg till affiliation"
				plain
				hoverIndicator
				onClick={addAffiliation}
			/>
		</Box>
	);
};

export default PersonDomainPartEdit;
