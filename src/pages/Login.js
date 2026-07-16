import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useDispatch } from 'react-redux';
import { login } from '../redux/sessionSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const storedPassword = localStorage.getItem(email);
      if (storedPassword && bcrypt.compareSync(password, storedPassword)) {
        dispatch(login({ email }));
        navigate('/dashboard'); 
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="d-flex vh-100">
      <div className="d-flex flex-column justify-content-center w-100 p-4 pl-15 pr-15 bg-light">
        <h1 className="text-center text-dark mb-4">
          Welcome Back <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-center text-muted mb-4">
          Today is a new day. It's your day. You shape it.<br></br>
          Sign in to start managing your projects.
        </p>
        <form className="mx-auto" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              //placeholder="example@email.com"
              className="form-control w-100"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
             // placeholder="At least 8 characters"
              className="form-control w-100"
            />
          </div>
          <div className="d-flex justify-content-end mb-3">
            <a href="#" className="text-primary text-decoration-none">Forgot Password?</a>
          </div>
          <button
            type="button"
            className="w-100 btn btn-primary"
            onClick={handleLogin}
          >
            Sign in
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-muted">Or</p>
          <p className="mt-2">
            Don’t have an account?{' '}
            <a href="#" className="text-primary text-decoration-none" onClick={() => navigate('/signup')}>Sign up</a>
          </p>
        </div>
      </div>
      <div className="d-none d-md-flex w-50 ">
        <img
          src="/image.png"
          alt="Decorative"
        className="w-100 h-100 object-cover"
          style={{ marginRight: '20px',width:"200px" ,paddingBottom:"20px",paddingTop:"20px",borderRadius:"5%" }} 
        />
      </div>
    </div>
  );
};

export default Login;
