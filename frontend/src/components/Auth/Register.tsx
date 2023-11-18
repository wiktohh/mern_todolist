import { useState, useEffect } from "react";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import ErrorHandler from "../ErrorHandler/ErrorHandler";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    secondPassword: "",
  });

  const { register, error, resetError } = useAuth();

  useEffect(() => {
    resetError();
  }, []);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetError();
    register(formData);
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Rejestracja</h2>
      <form className={styles.registerForm} onSubmit={submitForm}>
        <label htmlFor="name">Imię:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
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
        <label htmlFor="secondPassword">Powtórz hasło:</label>
        <input
          type="password"
          id="secondPassword"
          name="secondPassword"
          value={formData.secondPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, secondPassword: e.target.value }))
          }
        />

        <button type="submit">Zarejestruj sie</button>
      </form>
      <p className={styles.goToLogin}>
        Masz juz konto? <Link to="/">Zaloguj się</Link>
      </p>
      {error && <ErrorHandler message={error} />}
    </div>
  );
};

export default Register;
