import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    localStorage.setItem(email, hashedPassword);
    alert('Sign-up successful!');
    navigate('/login'); 
  };

  return (
    <div className="d-flex vh-100">
      <div className="d-flex flex-column justify-content-center w-100 p-4 bg-light">
        <h1 className="text-center text-dark mb-4">Sign Up</h1>
        <form className="mx-auto" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
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
              className="form-control"
            />
          </div>
          <button
            type="button"
            className="w-100 btn btn-primary"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-muted">Already have an account?</p>
          <p>
            <a href="#" className="text-primary text-decoration-none" onClick={() => navigate('/login')}>Login</a>
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

export default SignUp;
