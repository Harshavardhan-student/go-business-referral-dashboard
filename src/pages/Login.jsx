import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AUTH_SIGNIN_URL } from "../api/client";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Already logged in? Don't show the login form at all — bounce to dashboard.
  const existingToken = Cookies.get("jwt_token");
  if (existingToken) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(AUTH_SIGNIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();

      if (response.ok) {
        const token = responseJson.data.token;
        Cookies.set("jwt_token", token);
        navigate("/");
      } else {
        setErrorMessage(responseJson.message || "Invalid email or password");
      }
    } catch (error) {
      // Network failure, server unreachable, etc.
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Go Business</h1>
        <p className="login-tagline">Sign in to open your referral dashboard.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary login-submit" disabled={isSubmitting}>
            Sign in
          </button>

          {errorMessage && <p className="login-error">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;   