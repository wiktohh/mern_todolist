import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import styles from "./AddTaskInput.module.css";
import { TextField } from "@mui/material";

interface IAddTaskInput {
  getTasks: () => void;
}

const AddTaskInput = ({ getTasks }: IAddTaskInput) => {
  const [task, setTask] = useState("");

  const { user, token } = useAuth();

  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/task/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: task,
          creator: user?.username,
        }),
      });
      if (!response.ok) {
        throw new Error("cos tam niedziala");
      }
      getTasks();
      setTask("");
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <form onSubmit={addTask} className={styles.form}>
      <TextField
        className={styles.textField}
        fullWidth
        size="medium"
        variant="standard"
        inputProps={{ style: { fontSize: 32 } }}
        InputLabelProps={{ style: { fontSize: 32 } }}
        label="Dodaj zadanie"
        value={task}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTask(e.target.value)
        }
      />
    </form>
  );
};

export default AddTaskInput;
