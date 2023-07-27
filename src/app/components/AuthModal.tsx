'use client';

import { Alert, Box, CircularProgress, Modal } from '@mui/material';
import { useEffect, useState } from 'react';

import useAuth from '@/hooks/useAuth';

import { useAuthContext } from '../context/AuthContext';
import AuthModalForm from './AuthModalForm';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AuthModal = ({ isSignin }: { isSignin: boolean }) => {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { signin } = useAuth();
  const { data, error, loading } = useAuthContext();
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });

  const handleOpen = () => setOpen(open => !open);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    if (isSignin) {
      signin({ email: inputs.email, password: inputs.password }, handleOpen);
    }
  };

  const renderContent = (signinContent: string, signupContent: string) => {
    return isSignin ? signinContent : signupContent;
  };

  useEffect(() => {
    if (isSignin) {
      if (inputs.email && inputs.password) {
        return setDisabled(false);
      }
      setDisabled(true);
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.password &&
        inputs.city &&
        inputs.phone
      ) {
        setDisabled(false);
      }
    }
  }, [isSignin, inputs]);

  return (
    <div>
      <button
        className={`${renderContent(
          'bg-blue-400 text-white',
          '',
        )} border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContent('Sign In', 'Sign up')}
      </button>
      <Modal
        open={open}
        onClose={handleOpen}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          {loading ? (
            <div className='py-24 px-2 h-[600px] flex justify-center'>
              <CircularProgress />
            </div>
          ) : (
            <div className='p-2 h-[600px]'>
              {error && (
                <Alert severity='error' className='mb-4'>
                  {error}
                </Alert>
              )}
              <div className='uppercase font-bold text-center pb-2 border-b mb-2'>
                <p className='text-sm'>
                  {renderContent('Sign In', 'Create Account')}
                </p>
              </div>
              <div className='m-auto'>
                <h2 className='text-2xl font-light text-center'>
                  {renderContent(
                    'Log Into Your Account',
                    'Create Your OpenTable Account',
                  )}
                </h2>
                <AuthModalForm
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignin={isSignin}
                />
                <button
                  className='uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400'
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent('Sign In', 'Create Account')}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AuthModal;
