import { ExternalUrl, Name } from 'diva-cora-ts-api-wrapper';
import { FormPerson } from '../../../types/FormPerson';
import { Repeatable } from '../../../types/Repeatable';

export enum PersonActionType {
	UPDATE_STRING_FIELD = 'UPDATE_STRING_FIELD',
	UPDATE_ARRAY_STRING_FIELD = 'UPDATE_ARRAY_STRING_FIELD',
	ADD_ARRAY_STRING_FIELD = 'ADD_ARRAY_STRING_FIELD',
	DELETE_ARRAY_WITH_INDEX = 'DELETE_ARRAY_WITH_INDEX',
	DELETE_ARRAY_WITH_ID = 'DELETE_ARRAY_WITH_ID',
	UPDATE_ARRAY_OBJECT_FIELD = 'UPDATE_ARRAY_OBJECT_FIELD',
	ADD_ARRAY_OBJECT = 'ADD_ARRAY_OBJECT',
	UPDATE_OBJECT = 'UPDATE_OBJECT',
	TOGGLE_PUBLIC = 'TOGGLE_PUBLIC',
}

interface PersonActionPayload {
	field: keyof FormPerson;
}

interface PersonActionUpdateString extends PersonActionPayload {
	value: string;
}

interface PersonActionUpdateArray extends PersonActionUpdateString {
	index: number;
}

interface PersonActionUpdateObject extends PersonActionUpdateString {
	childField: string;
}

interface PersonActionUpdateArrayObject
	extends PersonActionUpdateArray,
		PersonActionUpdateObject {}

interface PersonActionDeleteArrayIndex extends PersonActionPayload {
	index: number;
}
interface PersonActionDeleteArrayId extends PersonActionPayload {
	repeatId: number;
}

interface PersonActionAddObject extends PersonActionPayload {
	emptyObject: Name | ExternalUrl;
}

export type PersonAction =
	| {
			type: PersonActionType.UPDATE_STRING_FIELD;
			payload: PersonActionUpdateString;
	  }
	| {
			type: PersonActionType.ADD_ARRAY_STRING_FIELD;
			payload: PersonActionPayload;
	  }
	| {
			type: PersonActionType.UPDATE_ARRAY_STRING_FIELD;
			payload: PersonActionUpdateArray;
	  }
	| {
			type: PersonActionType.UPDATE_OBJECT;
			payload: PersonActionUpdateObject;
	  }
	| {
			type: PersonActionType.ADD_ARRAY_OBJECT;
			payload: PersonActionAddObject;
	  }
	| {
			type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD;
			payload: PersonActionUpdateArrayObject;
	  }
	| {
			type: PersonActionType.DELETE_ARRAY_WITH_INDEX;
			payload: PersonActionDeleteArrayIndex;
	  }
	| {
			type: PersonActionType.DELETE_ARRAY_WITH_ID;
			payload: PersonActionDeleteArrayId;
	  }
	| {
			type: PersonActionType.TOGGLE_PUBLIC;
			payload: PersonActionPayload;
	  };

export const personReducer = (
	state: FormPerson,
	action: PersonAction
): FormPerson => {
	const { type, payload } = action;
	// eslint-disable-next-line default-case
	switch (type) {
		case PersonActionType.UPDATE_STRING_FIELD: {
			const actionPayload = payload as PersonActionUpdateString;
			return { ...state, [actionPayload.field]: actionPayload.value };
		}
		case PersonActionType.UPDATE_ARRAY_STRING_FIELD: {
			const actionPayload = payload as PersonActionUpdateArray;
			const currentArray = state[actionPayload.field] as any[];

			return {
				...state,
				[actionPayload.field]: currentArray.map(
					(item: string, i: number) => {
						if (actionPayload.index === i) {
							return actionPayload.value;
						}
						return item;
					}
				),
			};
		}
		case PersonActionType.ADD_ARRAY_STRING_FIELD: {
			const currentString = state[payload.field] as string;
			return {
				...state,
				[payload.field]: currentString.concat(''),
			};
		}
		case PersonActionType.UPDATE_ARRAY_OBJECT_FIELD: {
			const actionPayload = payload as PersonActionUpdateArrayObject;
			const { field, index: repeatId, childField, value } = actionPayload;
			const currentArray = state[field] as Repeatable<
				Name | ExternalUrl
			>[];

			return {
				...state,
				[field]: currentArray.map((item) => {
					if (repeatId === item.repeatId) {
						return {
							repeatId: item.repeatId,
							content: {
								...item.content,
								[childField]: value,
							},
						};
					}
					return item;
				}),
			};
		}
		case PersonActionType.DELETE_ARRAY_WITH_INDEX: {
			const actionPayload = payload as PersonActionDeleteArrayIndex;
			const { field, index } = actionPayload;
			const currentArray = state[field] as any[];

			return {
				...state,
				[field]: currentArray.filter((item: any, i: number) => {
					return i !== index;
				}),
			};
		}
		case PersonActionType.DELETE_ARRAY_WITH_ID: {
			const actionPayload = payload as PersonActionDeleteArrayId;
			const { field, repeatId } = actionPayload;
			const currentArray = state[field] as any[];

			return {
				...state,
				[field]: currentArray.filter((item: any) => {
					return item.repeatId !== repeatId;
				}),
			};
		}
		case PersonActionType.ADD_ARRAY_OBJECT: {
			const actionPayload = payload as PersonActionAddObject;
			const { field, emptyObject } = actionPayload;
			const currentArray = state[field] as Repeatable<any>[];

			return {
				...state,
				[field]: currentArray.concat({
					content: emptyObject,
					repeatId: getNextRepeatIdForArray(currentArray),
				}),
			};
		}
		case PersonActionType.UPDATE_OBJECT: {
			const actionPayload = payload as PersonActionUpdateObject;
			const { field, childField, value } = actionPayload;
			const currentObject = state[field] as Object;

			return {
				...state,
				[field]: {
					...currentObject,
					[childField]: value,
				},
			};
		}
		case PersonActionType.TOGGLE_PUBLIC: {
			const newPublic = state.public === 'yes' ? 'no' : 'yes';

			return {
				...state,
				public: newPublic,
			};
		}
	}
};
function getNextRepeatIdForArray(currentArray: Repeatable<any>[]): number {
	if (currentArray.length === 0) {
		return 0;
	}

	const repeatIds = currentArray.map(({ repeatId }) => repeatId);

	const currentlyHighestRepeatId = repeatIds.reduce((previous, current) =>
		current > previous ? current : previous
	);

	return currentlyHighestRepeatId + 1;
}
