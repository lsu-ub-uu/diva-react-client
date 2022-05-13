import { ExternalUrl, Name } from 'diva-cora-ts-api-wrapper';
import { ActionMap, createMsg } from '../../../types/reducerHelpers';
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

type Messages = {
	[PersonActionType.UPDATE_STRING_FIELD]: { field: string; value: string };
	[PersonActionType.UPDATE_ARRAY_STRING_FIELD]: {
		field: string;
		index: number;
		value: string;
	};
	[PersonActionType.ADD_ARRAY_STRING_FIELD]: { field: string };
	[PersonActionType.DELETE_ARRAY_WITH_INDEX]: { field: string; index: number };
	[PersonActionType.UPDATE_ARRAY_OBJECT_FIELD]: {
		field: string;
		index: number;
		childField: string;
		value: string;
	};
	[PersonActionType.ADD_ARRAY_OBJECT]: {
		field: string;
		emptyObject: Name | ExternalUrl;
	};
	[PersonActionType.UPDATE_OBJECT]: {
		field: string;
		childField: string;
		value: string;
	};
};

type PersonAction = ActionMap<Messages>[keyof ActionMap<Messages>];
export const PersonMessage = createMsg<Messages>();

export const personReducer = (
	state: FormPerson,
	action: PersonAction
): FormPerson => {
	switch (action.type) {
		case PersonActionType.UPDATE_STRING_FIELD: {
			return { ...state, [action.payload.field]: action.payload.value };
		}
		case PersonActionType.UPDATE_ARRAY_STRING_FIELD: {
			const castField = action.payload.field as keyof FormPerson;
			const currentArray = state[castField] as any[];

			return {
				...state,
				[action.payload.field]: currentArray.map((item: string, i: number) => {
					if (action.payload.index === i) {
						return action.payload.value;
					}
					return item;
				}),
			};
		}
		case PersonActionType.ADD_ARRAY_STRING_FIELD: {
			const castField = action.payload.field as keyof FormPerson;
			const currentString = state[castField] as string;
			return {
				...state,
				[action.payload.field]: currentString.concat(''),
			};
		}
		case PersonActionType.UPDATE_ARRAY_OBJECT_FIELD: {
			const { field, index, childField, value } = action.payload;
			const castField = action.payload.field as keyof FormPerson;

			const currentArray = state[castField] as any[];

			return {
				...state,
				[field]: currentArray.map((item: Name | ExternalUrl, i: number) => {
					if (index === i) {
						return {
							...item,
							[childField]: value,
						};
					}
					return item;
				}),
			};
		}
		case PersonActionType.DELETE_ARRAY_WITH_INDEX: {
			const { field, index } = action.payload;
			const castField = action.payload.field as keyof FormPerson;

			const currentArray = state[castField] as any[];

			return {
				...state,
				[field]: currentArray.filter((item: any, i: number) => {
					return i !== index;
				}),
			};
		}
		case PersonActionType.ADD_ARRAY_OBJECT: {
			const { field, emptyObject } = action.payload;
			const castField = action.payload.field as keyof FormPerson;

			const currentArray = state[castField] as Object[];

			return {
				...state,
				[field]: currentArray.concat(emptyObject),
			};
		}
		case PersonActionType.UPDATE_OBJECT: {
			const { field, childField, value } = action.payload;
			const castField = action.payload.field as keyof FormPerson;

			const currentObject = state[castField] as Object;

			return {
				...state,
				[field]: {
					...currentObject,
					[childField]: value,
				},
			};
		}
		default: {
			throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
		}
	}
};
