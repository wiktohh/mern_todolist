import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

interface IUser {
  name: string;
  username: string;
}

interface IRegisterData {
  name: string;
  username: string;
  password: string;
  secondPassword: string;
}

interface IAuthContext {
  error: string;
  user: IUser | null;
  isLoggedIn: boolean;
  token: string;
  login: (loginData: ILoginData) => void;
  logout: () => void;
  register: (registerData: IRegisterData) => void;
  resetError: () => void;
  setUserLoggedIn: () => void;
}

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<IAuthContext>({
  user: null,
  error: "",
  isLoggedIn: false,
  token: "",
  logout: () => {},
  login: () => {},
  register: () => {},
  resetError: () => {},
  setUserLoggedIn: () => {},
});

interface ILoginData {
  username: string;
  password: string;
}

interface IRegisterData {
  name: string;
  username: string;
  password: string;
  secondPassword: string;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const setUserLoggedIn = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const storedLoggedInStatus =
      localStorage.getItem("isLoggedIn") === "logged";
    if (storedLoggedInStatus) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (loginData: ILoginData) => {
    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setIsLoggedIn(true);
        setToken(data.token);
        history.push("/tasks");
        localStorage.setItem("isLoggedIn", "logged");
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
      });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  const resetError = () => {
    setError("");
  };

  const register = (registerData: IRegisterData) => {
    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setIsLoggedIn(true);
        setToken(data.token);
        history.push("/tasks");
        localStorage.setItem("isLoggedIn", "logged");
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const values = {
    user,
    login,
    logout,
    register,
    isLoggedIn,
    error,
    resetError,
    setUserLoggedIn,
    token,
  };
  console.log(values);
  return (
    !loading && (
      <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
  );
};
