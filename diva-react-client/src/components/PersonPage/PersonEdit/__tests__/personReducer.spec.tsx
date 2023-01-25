import {
	PersonAction,
	PersonActionType,
	personReducer,
} from '../personReducer';
import {
	createCompleteFormPerson,
	createMinimumFormPersonWithIdAndName,
} from '../../../../../testData/personObjectData';

import { FormPerson } from '../../../../types/FormPerson';

describe('personReducer', () => {
	it('add array object', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.ADD_ARRAY_OBJECT,
			payload: {
				emptyObject: { linkTitle: 'foo', URL: 'foo.se' },
				field: 'externalURLs' as keyof FormPerson,
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified: FormPerson = {
			...initialFormPerson,
			externalURLs: [
				...initialFormPerson.externalURLs,
				{ content: { linkTitle: 'foo', URL: 'foo.se' }, repeatId: 2 },
			],
		};

		expect(formPerson).toStrictEqual(formPersonModified);
	});

	it('add array object with empty array', () => {
		const initialFormPerson: FormPerson =
			createMinimumFormPersonWithIdAndName();

		const personAction: PersonAction = {
			type: PersonActionType.ADD_ARRAY_OBJECT,
			payload: {
				emptyObject: { familyName: '', givenName: '' },
				field: 'alternativeNames' as keyof FormPerson,
			},
		};

		const alteredFormPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);
		const expectedFormPerson: FormPerson = {
			...initialFormPerson,
		};

		expectedFormPerson.alternativeNames.push({
			repeatId: 0,
			content: { familyName: '', givenName: '' },
		});

		expect(alteredFormPerson).toStrictEqual(expectedFormPerson);
	});

	it('add array object with Repeatables that are in different order', () => {
		const initialFormPerson: FormPerson =
			createMinimumFormPersonWithIdAndName();

		initialFormPerson.alternativeNames = [
			{
				repeatId: 3,
				content: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
			{
				repeatId: 1,
				content: {
					familyName: 'MMbaa',
					givenName: 'Fifi',
				},
			},
		];

		const personAction: PersonAction = {
			type: PersonActionType.ADD_ARRAY_OBJECT,
			payload: {
				emptyObject: { familyName: '', givenName: '' },
				field: 'alternativeNames' as keyof FormPerson,
			},
		};

		const alteredFormPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);
		const expectedFormPerson: FormPerson = {
			...initialFormPerson,
		};

		expectedFormPerson.alternativeNames.push({
			repeatId: 4,
			content: { familyName: '', givenName: '' },
		});

		expect(alteredFormPerson).toStrictEqual(expectedFormPerson);
	});

	it('add string field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.ADD_ARRAY_STRING_FIELD,
			payload: {
				field: 'orcids' as keyof FormPerson,
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		initialFormPerson.orcids.push('');

		expect(formPerson).toStrictEqual(initialFormPerson);
	});

	it('update string field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_STRING_FIELD,
			payload: {
				value: 'doktor',
				field: 'academicTitle' as keyof FormPerson,
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified: FormPerson = initialFormPerson;
		formPersonModified.academicTitle = 'doktor';

		expect(formPerson).toStrictEqual(formPersonModified);
	});

	it('update array object field and return item', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
			payload: {
				index: 1,
				field: 'alternativeNames',
				childField: 'givenName' as keyof FormPerson,
				value: 'Ada',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.alternativeNames[0]).toStrictEqual({
			content: {
				familyName: 'someAlternativeFamilyName',
				givenName: 'someAlternativeGivenName',
			},
			repeatId: 0,
		});

		expect(formPersonModified.alternativeNames[1]).toStrictEqual({
			content: {
				familyName: 'someOtherAlternativeFamilyName',
				givenName: 'Ada',
			},
			repeatId: 1,
		});
	});

	it('update array object field and return state', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD,
			payload: {
				index: 2,
				field: 'alternativeNames',
				childField: 'givenName' as keyof FormPerson,
				value: 'Kålle',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.alternativeNames[0]).toStrictEqual({
			content: {
				familyName: 'someAlternativeFamilyName',
				givenName: 'someAlternativeGivenName',
			},
			repeatId: 0,
		});
	});

	it('toggle public yes -> no', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.public = 'yes';

		const personAction: PersonAction = {
			type: PersonActionType.TOGGLE_PUBLIC,
			payload: {
				field: 'public',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.public).toBe('no');
	});

	it('toggle public no -> yes', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.public = 'no';

		const personAction: PersonAction = {
			type: PersonActionType.TOGGLE_PUBLIC,
			payload: {
				field: 'public',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.public).toBe('yes');
	});

	it('update array string field', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.domains = ['uu', 'slu'];

		const personAction: PersonAction = {
			type: PersonActionType.UPDATE_ARRAY_STRING_FIELD,
			payload: {
				index: 1,
				field: 'domains',
				value: 'su',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.domains[1]).toBe('su');
	});

	it('delete array with index', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.domains = ['uu', 'slu'];

		const personAction: PersonAction = {
			type: PersonActionType.DELETE_ARRAY_WITH_INDEX,
			payload: {
				index: 1,
				field: 'domains',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.domains[1]).toBeUndefined();
	});

	it('delete array with id', () => {
		const initialFormPerson: FormPerson = createCompleteFormPerson();
		initialFormPerson.alternativeNames = [
			{ content: { familyName: 'Smith', givenName: 'Bob' }, repeatId: 1 },
		];

		const personAction: PersonAction = {
			type: PersonActionType.DELETE_ARRAY_WITH_ID,
			payload: {
				repeatId: 1,
				field: 'alternativeNames',
			},
		};
		const formPerson: FormPerson = personReducer(
			initialFormPerson,
			personAction
		);

		const formPersonModified = formPerson;

		expect(formPersonModified.alternativeNames).toStrictEqual([]);
	});
});
