import { useEffect, useState } from "react";
import Task from "./Task";
import styles from "./TaskList.module.css";
import { useAuth } from "../../context/auth-context";
import AddTaskInput from "../AddTaskInput/AddTaskInput";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface ITask {
  content: string;
  creator: string;
  _id: string;
  __v: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<ITask[]>();
  const [isLoading, setIsLoading] = useState(false);

  const { user, token } = useAuth();

  const getTasks = async () => {
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:3000/task/task/${user?.username}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setTasks(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <AddTaskInput getTasks={getTasks} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className={styles.list}>
          {tasks?.length !== 0 ? (
            tasks?.map((task, index) => (
              <Task
                key={index}
                getTasks={getTasks}
                id={task._id}
                content={task.content}
              />
            ))
          ) : (
            <p className={styles.noTaskText}>Nie masz aktualnie zadań</p>
          )}
        </div>
      )}
    </>
  );
};

export default TaskList;
