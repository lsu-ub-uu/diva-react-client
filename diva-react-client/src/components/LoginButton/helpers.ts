const getIdpLoginServerPartFromUrl = (urlToWebRedirectLogin: string) => {
	const targetPart = urlToWebRedirectLogin.substring(
		urlToWebRedirectLogin.indexOf('target=') + 7
	);
	const lengthOfHttps = 'https://'.length;
	return targetPart.substring(0, targetPart.indexOf('/', lengthOfHttps));
};

export default getIdpLoginServerPartFromUrl;
