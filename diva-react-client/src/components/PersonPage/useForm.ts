import React, { useState } from 'react';

const useForm = <T>(initial: T) => {
	const [inputs, setInputs] = useState<T>(initial);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.name);

		const { name } = e.target;

		if (name.indexOf('[') > 0) {
			// Array
			const parentPropertyName = name.substring(0, name.indexOf('['));
			console.log(parentPropertyName); // viafIDs

			const index = name.substring(name.indexOf('[') + 1, name.indexOf(']'));
			console.log(index); // 0

			const childPropertyPart = name.substring(name.indexOf(']') + 1);
			console.log(childPropertyPart);

			const originalParent = (inputs as any)[parentPropertyName];

			if (childPropertyPart !== '') {
				// parentPropertyName is an object

				const childPropertyName = childPropertyPart.replace('.', '');

				console.log(`parentPropertyName: ${parentPropertyName}`);

				originalParent[index][childPropertyName] = e.target.value;

				console.log(originalParent);

				setInputs({
					...inputs,
					[parentPropertyName]: originalParent,
				});
			} else {
				originalParent[index] = e.target.value;

				setInputs({
					...inputs,
					[parentPropertyName]: originalParent,
				});
			}
		} else if (name.indexOf('.') > 0) {
			const parts = name.split('.');

			// const {parts[0]} = inputs;

			const originalObject = (inputs as any)[parts[0]];

			const alteredObject = {
				...originalObject,
				[parts[1]]: e.target.value,
			};
			console.log(alteredObject);

			setInputs({
				...inputs,
				[parts[0]]: alteredObject,
			});
		}
		// console.log(inputs);
	};

	return { inputs, handleChange, setInputs };
};

export default useForm;
