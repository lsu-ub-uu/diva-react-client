import React from 'react';
import Button from '../../styles/Button';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = function () {
	useAuth();
	return <Button type="button">Logout</Button>;
};

export default LogoutButton;
