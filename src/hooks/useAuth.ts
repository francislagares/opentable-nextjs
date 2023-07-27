import axios from 'axios';

import { useAuthContext } from '@/app/context/AuthContext';

interface SignIn {
  email: string;
  password: string;
}

interface SignUp extends SignIn {
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
}

const useAuth = () => {
  const { setAuthState } = useAuthContext();

  const signin = async (
    { email, password }: SignIn,
    handleOpen: () => void,
  ) => {
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
      handleOpen();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signup = async (
    { email, password, firstName, lastName, city, phone }: SignUp,
    handleClose: () => void,
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/signup',
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phone,
        },
      );
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  return {
    signin,
    signup,
  };
};

export default useAuth;
