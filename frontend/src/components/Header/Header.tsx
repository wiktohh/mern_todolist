import { useAuth } from "../../context/auth-context";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <h1>TodoApp</h1>
      {user && (
        <div className={styles.authSection}>
          <p>Jesteś zalogowany jako: {user?.name}</p>
          <button onClick={logout}>Wyloguj</button>
        </div>
      )}
    </header>
  );
};

export default Header;
