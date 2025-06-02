import { useEffect } from 'react';
import { loginWithGoogle } from '../../api/auth';

const AuthCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      loginWithGoogle(code)
        .then(({ token }) => {
          localStorage.setItem('token', token);
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Ошибка авторизации:', error);
        });
    }
  }, []);

  return <div>Авторизация...</div>;
};

export default AuthCallback;