const GoogleLoginButton = () => {
  const handleLogin = () => {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID';
    const redirectUri = encodeURIComponent('http://localhost:5173/auth/callback');
    const scope = encodeURIComponent('email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin}>Войти через Google</button>
  );
};

export default GoogleLoginButton;