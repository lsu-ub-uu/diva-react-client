export function getGerd(): Object {
	return {
		dataList: {
			fromNo: '1',
			data: [
				{
					record: {
						data: {
							children: [
								{
									children: [
										{
											name: 'id',
											value: 'authority-person:112',
										},
										{
											children: [
												{
													name: 'linkedRecordType',
													value: 'recordType',
												},
												{
													name: 'linkedRecordId',
													value: 'person',
												},
											],
											actionLinks: {
												read: {
													requestMethod: 'GET',
													rel: 'read',
													url: 'https://cora.epc.ub.uu.se/diva/rest/record/recordType/person',
													accept: 'application/vnd.uub.record+json',
												},
											},
											name: 'type',
										},
										{
											children: [
												{
													name: 'linkedRecordType',
													value: 'user',
												},
												{
													name: 'linkedRecordId',
													value: 'rinst123',
												},
											],
											name: 'createdBy',
										},
										{
											name: 'tsCreated',
											value: '2021-03-23T13:46:04.970Z',
										},
										{
											children: [
												{
													name: 'linkedRecordType',
													value: 'system',
												},
												{
													name: 'linkedRecordId',
													value: 'diva',
												},
											],
											actionLinks: {
												read: {
													requestMethod: 'GET',
													rel: 'read',
													url: 'https://cora.epc.ub.uu.se/diva/rest/record/system/diva',
													accept: 'application/vnd.uub.record+json',
												},
											},
											name: 'dataDivider',
										},
										{
											repeatId: '0',
											children: [
												{
													children: [
														{
															name: 'linkedRecordType',
															value: 'user',
														},
														{
															name: 'linkedRecordId',
															value: 'rinst123',
														},
													],
													name: 'updatedBy',
												},
												{
													name: 'tsUpdated',
													value: '2021-03-24T04:25:30.434Z',
												},
											],
											name: 'updated',
										},
										{
											name: 'public',
											value: 'yes',
										},
										{
											repeatId: '0',
											name: 'domain',
											value: 'test',
										},
										{
											repeatId: '1',
											name: 'domain',
											value: 'uu',
										},
									],
									name: 'recordInfo',
								},
								{
									children: [
										{
											name: 'familyName',
											value: 'Enequist',
										},
										{
											name: 'givenName',
											value: 'Gerd',
										},
									],
									name: 'authorisedName',
								},
								{
									name: 'academicTitle',
									value: 'Professor',
								},
								{
									name: 'yearOfBirth',
									value: '1903',
								},
								{
									name: 'yearOfDeath',
									value: '1989',
								},
								{
									name: 'emailAddress',
									value: 'gerd@enequist.se',
								},
								{
									repeatId: '0',
									children: [
										{
											name: 'familyName',
											value: 'Enequist',
										},
										{
											name: 'givenName',
											value: 'Gerd Margareta',
										},
									],
									name: 'alternativeName',
								},
								{
									repeatId: '0',
									children: [
										{
											name: 'affiliation',
											value: 'Fritextorganisation',
										},
										{
											name: 'affiliationFromYear',
											value: '1949',
										},
										{
											name: 'affiliationUntilYear',
											value: '1950',
										},
									],
									name: 'otherAffiliation',
								},
								{
									repeatId: '0',
									name: 'ORCID_ID',
									value: '0000-0003-5342-25345',
								},
								{
									repeatId: '0',
									name: 'VIAF_ID',
									value: '66928422',
								},
								{
									repeatId: '0',
									name: 'Libris_ID',
									value: '543453',
								},
								{
									children: [
										{
											name: 'biography',
											value:
												'<p>Gerd Margareta Enequist, född 24 februari 1903 i Luleå, död 21 maj 1989 i Uppsala domkyrkoförsamling[1], var en svensk geograf och professor.</p><p>Enequist var dotter till lanträntmästaren Axel Enequist och Anna Hederstedt. Efter studentexamen i Göteborg 1922 och folkskollärarexamen i Luleå 1923 blev Enequist filosofie magister i Uppsala 1929, filosofie licentiat 1934, filosofie doktor och docent i geografi vid Uppsala universitet 1937. Hon var professor i geografi, särskilt kulturgeografi med ekonomisk geografi mellan 1949 och 1968, tillförordnad redan 1947.</p><p>Enequist var ledamot delegationen för vägplanering 1954–1958 och av redaktionskommittén för Atlas över Sverige, i vilken hon medverkade med kartor som beskrev befolkning, bebyggelse och näringsliv. Hon var inspektor vid kommunala flickskolan i Uppsala och Uppsala högre elementarläroverk samt ledamot av kyrkofullmäktige 1951–57.</p><p>Enequist blev korresponderande ledamot av Österreichische Gesellschaft zur Förderung von Landesforschung und Landesplanung 1955, ledamot av Kungliga Humanistiska vetenskapssamfundet i Uppsala 1956, av Kungliga Skytteanska samfundet 1956, hedersledamot av Upplands fornminnesförening 1976 och av Olaus Magnus-sällskapet 1976. Hon blev filosofie hedersdoktor i Umeå 1982 och var ledamot av Nordstjärneorden.</p>',
										},
										{
											name: 'language',
											value: 'en',
										},
									],
									name: 'biographyEnglish',
								},
								{
									children: [
										{
											name: 'biography',
											value:
												'<p>Gerd Margareta Enequist, född 24 februari 1903 i Luleå, död 21 maj 1989 i Uppsala domkyrkoförsamling[1], var en svensk geograf och professor.</p><p>Gerd Margareta Enequist, född 24 februari 1903 i Luleå, död 21 maj 1989 i Uppsala domkyrkoförsamling[1], var en svensk geograf och professor.</p><p>Enequist var dotter till lanträntmästaren Axel Enequist och Anna Hederstedt. Efter studentexamen i Göteborg 1922 och folkskollärarexamen i Luleå 1923 blev Enequist filosofie magister i Uppsala 1929, filosofie licentiat 1934, filosofie doktor och docent i geografi vid Uppsala universitet 1937. Hon var professor i geografi, särskilt kulturgeografi med ekonomisk geografi mellan 1949 och 1968, tillförordnad redan 1947.</p><p>Enequist var ledamot delegationen för vägplanering 1954–1958 och av redaktionskommittén för Atlas över Sverige, i vilken hon medverkade med kartor som beskrev befolkning, bebyggelse och näringsliv. Hon var inspektor vid kommunala flickskolan i Uppsala och Uppsala högre elementarläroverk samt ledamot av kyrkofullmäktige 1951–57.</p><p>Enequist blev korresponderande ledamot av Österreichische Gesellschaft zur Förderung von Landesforschung und Landesplanung 1955, ledamot av Kungliga Humanistiska vetenskapssamfundet i Uppsala 1956, av Kungliga Skytteanska samfundet 1956, hedersledamot av Upplands fornminnesförening 1976 och av Olaus Magnus-sällskapet 1976. Hon blev filosofie hedersdoktor i Umeå 1982 och var ledamot av Nordstjärneorden.</p>',
										},
										{
											name: 'language',
											value: 'sv',
										},
									],
									name: 'biographySwedish',
								},
								{
									repeatId: '0',
									children: [
										{
											name: 'linkedRecordType',
											value: 'personDomainPart',
										},
										{
											name: 'linkedRecordId',
											value: 'authority-person:112:test',
										},
									],
									actionLinks: {
										read: {
											requestMethod: 'GET',
											rel: 'read',
											url: 'https://cora.epc.ub.uu.se/diva/rest/record/personDomainPart/authority-person:112:test',
											accept: 'application/vnd.uub.record+json',
										},
									},
									name: 'personDomainPart',
								},
								{
									repeatId: '1',
									children: [
										{
											name: 'linkedRecordType',
											value: 'personDomainPart',
										},
										{
											name: 'linkedRecordId',
											value: 'authority-person:112:uu',
										},
									],
									actionLinks: {
										read: {
											requestMethod: 'GET',
											rel: 'read',
											url: 'https://cora.epc.ub.uu.se/diva/rest/record/personDomainPart/authority-person:112:uu',
											accept: 'application/vnd.uub.record+json',
										},
									},
									name: 'personDomainPart',
								},
							],
							name: 'person',
						},
					},
				},
			],
			totalNo: '1',
			containDataOfType: 'mix',
			toNo: '1',
		},
	};
}

export default { getGerd };
