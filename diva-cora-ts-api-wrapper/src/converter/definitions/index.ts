import { RecordType } from '../../types/Record';
import { Matcher } from '../Converter';
import collectionMatcher, {
	genericCollectionItemMatcher,
} from './CollectionDefinition';
import coraTextMatcher from './CoraTextDefinition';
import loginUnitMatcher from './LoginUnitDefinitions';
import loginWebRedirectMatcher from './LoginWebRedirect';
import organisationMatcher from './OrganisationDefinitions';
import personMatcher from './PersonDefinitions';
import personDomainPartMatcher from './PersonDomainPartDefinitions';

const recordTypeToMatcher: { [key: string]: Matcher } = {
	person: personMatcher,
	personDomainPart: personDomainPartMatcher,
	organisation: organisationMatcher,
	metadataItemCollection: collectionMatcher,
	genericCollectionItem: genericCollectionItemMatcher,
	coraText: coraTextMatcher,
	loginUnit: loginUnitMatcher,
	loginWebRedirect: loginWebRedirectMatcher,
};

const getMatcherForRecordType = (recordType: RecordType): Matcher => {
	return recordTypeToMatcher[recordType];
};

export default getMatcherForRecordType;
