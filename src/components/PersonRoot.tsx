import React from 'react';
import { Outlet } from 'react-router';

const PersonRoot = function () {
	return (
		<>
			<h1>Personer</h1>
			<Outlet />
		</>
	);
};

export default PersonRoot;
