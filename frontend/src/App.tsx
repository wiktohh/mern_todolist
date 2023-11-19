import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Header from "./components/Header/Header";
import TaskList from "./components/TaskList/TaskList";
import { useAuth } from "./context/auth-context";

function App() {
  const { token } = useAuth();

  return (
    <>
      <Header />
      <Switch>
        <Route path="/" exact>
          {token ? <Redirect to="/tasks" /> : <Login />}
        </Route>
        <Route path="/register" exact>
          {token ? <Redirect to="/tasks" /> : <Register />}
        </Route>
        {token ? (
          <Route path="/tasks" exact component={TaskList} />
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    </>
  );
}

export default App;
