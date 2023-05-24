import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleRegister = () => {
    axios
      .post('http://localhost:5000/register', {
        username,
        password,
      })
      .then(() => {
        setRegisterSuccess(true);
        console.log('Registered successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogin = () => {
    axios
      .post('http://localhost:5000/login', {
        username,
        password,
      })
      .then((response) => {
        setToken(response.data.token);
        setLoginSuccess(true);
        console.log('Logged in successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<Register handleRegister={handleRegister} setUsername={setUsername} setPassword={setPassword} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />} />
          <Route path="/" element={<Home token={token} username={username} registerSuccess={registerSuccess} loginSuccess={loginSuccess} />} />

        </Routes>
      </div>
    </Router>
  );
}

function Register({ handleRegister, setUsername, setPassword }) {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => {
        handleRegister();
        navigateToHome();
      }}>Register</button>
    </div>
  );
}

function Login({ handleLogin, setUsername, setPassword }) {
  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function Home({ token, username, registerSuccess, loginSuccess }) {
  return (
    <div>
      {registerSuccess && <h2>Registration successful!</h2>}
      {loginSuccess && <h2>Login successful!</h2>}
      {token ? (
        <h2>Welcome, {username}!</h2>
      ) : (
        <h2>Please register or login</h2>
      )}
    </div>
  );
}

export default App;