import React, { useState } from 'react';
import { loginWithCredentials } from '../../api/auth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await loginWithCredentials(username, password);
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;