import { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import ErrorHandler from "../ErrorHandler/ErrorHandler";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login, error, resetError } = useAuth();

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  };

  useEffect(() => {
    resetError();
  }, []);

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form className={styles.loginForm} onSubmit={submitForm}>
        <label htmlFor="username">Nazwa użytkownika:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
        />

        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
        />

        <button type="submit">Zaloguj się</button>
      </form>
      <p className={styles.goToRegister}>
        Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
      </p>
      {error && <ErrorHandler message={error} />}
    </div>
  );
};

export default Login;
