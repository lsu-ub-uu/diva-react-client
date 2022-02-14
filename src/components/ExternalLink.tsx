import React from 'react';

const ExternalLink = function (props: { URL: string; text: string }) {
	const { URL, text } = props;
	return <a href={URL}>{text}</a>;
};

export default ExternalLink;
