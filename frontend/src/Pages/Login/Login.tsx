import { useState } from 'react';
import { emailValidator } from '../../utilities/utilities';
import './Login.scss';
import { login } from '../../utilities/api';

const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {

    const target = e.target as HTMLInputElement;
    setUserCred({ ...userCred, [target.name]: target.value });
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }
    if (!emailValidator(email)) {
      alert("Please enter a valid email address");
      return;
    }
    login(email, password).then((res) => {
      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('email', res.email);
      window.location.href = "/dashboard";

    }).catch((err) => {
      alert("Login failed. Please check your credentials.");
    }
    );
  }


  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" onClick={handleSubmit} className="login-button">SignIn</button>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
