import { FormPersonDomainPart } from '../../../types/FormPersonDomainPart';

export enum PersonDomainPartActionType {
	SET_AFFILIATION_FIELD = 'set_affiliation_field',
	DELETE_AFFILIATION = 'DELETE_AFFILIATION',
	ADD_AFFILIATION = 'ADD_AFFILIATION',
}

export type PersonDomainpartAction =
	| {
			type: PersonDomainPartActionType.SET_AFFILIATION_FIELD;
			payload: {
				personDomainPartId: string;
				affiliationId: string;
				field: string;
				value: string;
			};
	  }
	| {
			type: PersonDomainPartActionType.DELETE_AFFILIATION;
			payload: {
				personDomainPartId: string;
				affiliationId: string;
			};
	  }
	| {
			type: PersonDomainPartActionType.ADD_AFFILIATION;
			payload: {
				personDomainPartId: string;
				affiliationId: string;
			};
	  };

export const personDomainPartReducer = (
	state: FormPersonDomainPart[],
	action: PersonDomainpartAction
): FormPersonDomainPart[] => {
	const { type } = action;
	const { personDomainPartId } = action.payload;
	switch (type) {
		case PersonDomainPartActionType.SET_AFFILIATION_FIELD:
			// eslint-disable-next-line no-case-declarations
			const {
				payload: { field, value },
			} = action;
			return state.map((personDomainPart) => {
				if (personDomainPart.id === personDomainPartId) {
					return {
						...personDomainPart,
						affiliations: personDomainPart.affiliations.map((affiliation) => {
							if (affiliation.id === action.payload.affiliationId) {
								return {
									...affiliation,
									[field]: value,
								};
							}
							return affiliation;
						}),
					};
				}
				return personDomainPart;
			});
		case PersonDomainPartActionType.DELETE_AFFILIATION:
			return state.map((personDomainpart) => {
				if (personDomainpart.id === personDomainPartId) {
					return {
						...personDomainpart,
						affiliations: personDomainpart.affiliations.filter((item: any) => {
							return item.id !== action.payload.affiliationId;
						}),
					};
				}
				return personDomainpart;
			});
		case PersonDomainPartActionType.ADD_AFFILIATION:
			return state.map((personDomainpart) => {
				if (personDomainpart.id === personDomainPartId) {
					return {
						...personDomainpart,
						affiliations: personDomainpart.affiliations.concat({
							id: action.payload.affiliationId,
							fromYear: '',
							untilYear: '',
						}),
					};
				}
				return personDomainpart;
			});

		default: {
			throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
		}
	}
};
