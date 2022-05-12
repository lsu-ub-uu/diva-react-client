import { ExternalUrl, Name } from 'diva-cora-ts-api-wrapper';
import { FormPerson } from './FormPerson';

export enum PersonActionType {
	UPDATE_STRING_FIELD = 'UPDATE_STRING_FIELD',
	UPDATE_ARRAY_STRING_FIELD = 'UPDATE_ARRAY_STRING_FIELD',
	ADD_ARRAY_STRING_FIELD = 'ADD_ARRAY_STRING_FIELD',
	DELETE_ARRAY_WITH_INDEX = 'DELETE_ARRAY_WITH_INDEX',
	UPDATE_ARRAY_OBJECT_FIELD = 'UPDATE_ARRAY_OBJECT_FIELD',
	ADD_ARRAY_OBJECT = 'ADD_ARRAY_OBJECT',
	UPDATE_OBJECT = 'UPDATE_OBJECT',
}

export type PersonAction =
	| {
			type: PersonActionType.UPDATE_STRING_FIELD;
			payload: {
				field: string;
				value: string;
			};
	  }
	| {
			type: PersonActionType.ADD_ARRAY_STRING_FIELD;
			payload: {
				field: string;
			};
	  }
	| {
			type: PersonActionType.UPDATE_ARRAY_STRING_FIELD;
			payload: {
				field: string;
				value: string;
				index: number;
			};
	  }
	| {
			type: PersonActionType.UPDATE_OBJECT;
			payload: {
				field: string;
				childField: string;
				value: string;
			};
	  }
	| {
			type: PersonActionType.ADD_ARRAY_OBJECT;
			payload: {
				field: string;
				emptyObject: Name | ExternalUrl;
			};
	  }
	| {
			type: PersonActionType.UPDATE_ARRAY_OBJECT_FIELD;
			payload: {
				field: string;
				childField: string;
				value: string;
				index: number;
			};
	  }
	| {
			type: PersonActionType.DELETE_ARRAY_WITH_INDEX;
			payload: {
				field: string;
				index: number;
			};
	  };

export const personReducer = (
	state: FormPerson,
	action: PersonAction
): FormPerson => {
	const { type, payload } = action;
	switch (type) {
		case PersonActionType.UPDATE_STRING_FIELD:
			return { ...state, [payload.field]: payload.value };
		case PersonActionType.UPDATE_ARRAY_STRING_FIELD:
			return {
				...state,
				[payload.field]: state[payload.field].map((item: string, i: number) => {
					if (payload.index === i) {
						return payload.value;
					}
					return item;
				}),
			};
		case PersonActionType.ADD_ARRAY_STRING_FIELD:
			return {
				...state,
				[payload.field]: state[payload.field].concat(''),
			};
		case PersonActionType.UPDATE_ARRAY_OBJECT_FIELD:
			return {
				...state,
				[payload.field]: state[payload.field].map(
					(item: Name | ExternalUrl, i: number) => {
						if (payload.index === i) {
							return {
								...item,
								[payload.childField]: payload.value,
							};
						}
						return item;
					}
				),
			};
		case PersonActionType.DELETE_ARRAY_WITH_INDEX:
			return {
				...state,
				[payload.field]: state[payload.field].filter((item: any, i: number) => {
					if (i !== payload.index) {
						return item;
					}
				}),
			};
		case PersonActionType.ADD_ARRAY_OBJECT:
			return {
				...state,
				[payload.field]: state[payload.field].concat(payload.emptyObject),
			};
		case PersonActionType.UPDATE_OBJECT:
			return {
				...state,
				[payload.field]: {
					...state[payload.field],
					[payload.childField]: payload.value,
				},
			};
		default: {
			throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
		}
	}
};
