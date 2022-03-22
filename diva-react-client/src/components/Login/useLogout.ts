import axios, { AxiosResponse } from 'axios';
import { useAuth, LOGIN_STATUS } from '../../context/AuthContext';

const useLogout = () => {
	const { auth, onAuthChange } = useAuth();

	return {
		logout: async () => {
			return new Promise<void>((resolve, reject) => {
				if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
					reject(new Error('Cannot log out if already logged out.'));
				}

				axios
					.delete(auth.deleteUrl, {
						headers: { authToken: auth.token },
						data: auth.token,
					})
					.then((response: AxiosResponse) => {
						if (response.status === 200) {
							onAuthChange({
								deleteUrl: '',
								idFromLogin: '',
								token: '',
								status: LOGIN_STATUS.LOGGED_OUT,
							});
							resolve();
						}
						reject(new Error(response.statusText));
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
	};
};

export default useLogout;
