import { useState } from "react";
import styles from "./Task.module.css";
import { Card, TextField, Button } from "@mui/material";
import { useAuth } from "../../context/auth-context";

interface ITask {
  content: string;
  id: string;
  getTasks: () => void;
}

const Task = ({ content, id, getTasks }: ITask) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState(content);

  const { token } = useAuth();

  const handleEditMode = () => {
    setEditedTask(content);
    setIsEditMode((prevState) => !prevState);
  };

  const editTask = async () => {
    try {
      const response = await fetch(`http://localhost:3000/task/task/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newValue: editedTask,
        }),
      });
      if (!response.ok) {
        throw new Error("cos tam niedziala");
      }
      getTasks();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const removeTask = async () => {
    await fetch(`http://localhost:3000/task/task/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });
    getTasks();
  };

  return (
    <Card className={styles.task}>
      {isEditMode && (
        <TextField
          className={styles.input}
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
          inputProps={{ style: { fontSize: 32, textTransform: "uppercase" } }}
          InputLabelProps={{
            style: { fontSize: 32, textTransform: "uppercase" },
          }}
        />
      )}
      {!isEditMode && <p>{content}</p>}
      <div className={styles.buttons}>
        <Button onClick={handleEditMode}>
          {!isEditMode ? "Edytuj" : "Anuluj"}
        </Button>
        {!isEditMode && <Button onClick={removeTask}>Usuń</Button>}
        {isEditMode && <Button onClick={editTask}>Zapisz</Button>}
      </div>
    </Card>
  );
};

export default Task;
