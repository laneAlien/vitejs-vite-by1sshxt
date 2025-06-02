import GoogleLoginButton from '../../components/Auth/GoogleLoginButton';
import LoginForm from '../../components/Auth/LoginForm';

const Login = () => {
  return (
    <div>
      <h1>Вход</h1>
      <GoogleLoginButton />
      <LoginForm />
    </div>
  );
};

export default Login;