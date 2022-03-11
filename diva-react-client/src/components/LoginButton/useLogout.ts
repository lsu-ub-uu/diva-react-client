import axios from 'axios';
import { useAuth, LOGIN_STATUS } from '../../context/AuthContext';

const useLogout = () => {
	const { auth } = useAuth();

	return {
		logout: () => {
			if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
				throw new Error('Cannot log out if already logged out.');
			}
			axios.delete(auth.deleteUrl, { headers: { authToken: auth.token } });
		},
	};
};

export default useLogout;
