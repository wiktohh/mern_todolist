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
  token: string;
  login: (loginData: ILoginData) => void;
  logout: () => void;
  register: (registerData: IRegisterData) => void;
  resetError: () => void;
}

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<IAuthContext>({
  user: null,
  error: "",
  token: "",
  logout: () => {},
  login: () => {},
  register: () => {},
  resetError: () => {},
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
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const getUser = async (token: string) => {
    const response = await fetch("http://localhost:3000/auth/getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);

        await getUser(storedToken);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const login = async (loginData: ILoginData) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      localStorage.setItem("token", data);
      setToken(() => data);
      await getUser(data);
      history.push("/tasks");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(() => "");
    localStorage.removeItem("token");
  };

  const resetError = () => {
    setError("");
  };

  const register = async (registerData: IRegisterData) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      await getUser(data);
      history.push("/tasks");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
    setLoading(false);
  };

  const values = {
    user,
    login,
    logout,
    register,
    error,
    resetError,
    token,
  };
  return (
    !loading && (
      <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
  );
};
