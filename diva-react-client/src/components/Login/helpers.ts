const getIdpLoginServerPartFromUrl = (urlToWebRedirectLogin: string) => {
	if (process.env.FAKE_IDPLOGINSERVERPART) {
		return process.env.FAKE_IDPLOGINSERVERPART;
	}
	const targetPart = urlToWebRedirectLogin.substring(
		urlToWebRedirectLogin.indexOf('target=') + 7
	);
	const lengthOfHttps = 'https://'.length;
	return targetPart.substring(0, targetPart.indexOf('/', lengthOfHttps));
};

export const escapeSearchString = (text: string) => {
	return text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
};

export default getIdpLoginServerPartFromUrl;
