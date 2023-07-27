import axios from 'axios';

import { useAuthContext } from '@/app/context/AuthContext';

interface SignIn {
  email: string;
  password: string;
}

const useAuth = () => {
  const { data, error, loading, setAuthState } = useAuthContext();

  const signin = async ({ email, password }: SignIn) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/signin',
        {
          email,
          password,
        },
      );
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };
  const signup = async () => {};

  return {
    signin,
    signup,
  };
};

export default useAuth;
