import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Task } from "../types/task";
import { v4 as uuidv4 } from "uuid";

interface TaskContextType {
  tasks: Task[];
  // set the return type to boolean to indicate whether the operation is successful
  addTask: (task: Omit<Task, "id" | "createdAt">) => boolean;
  updateTask: (id: string, updates: Partial<Task>) => void;
  // set the return type to boolean to indicate whether the operation is successful
  deleteTask: (id: string) => boolean;
  filterTasks: (status?: Task["status"], priority?: Task["priority"]) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: "Initial Task",
      // "todo111" is not the correct type of Task["status"]
      // status: "todo111",
      status: "todo",
      priority: "medium",
      createdAt: new Date(),
      description: "This is a sample task to start with",
    },
    {
      id: uuidv4(),
      title: "Second Task",
      status: "todo",
      priority: "high",
      createdAt: new Date(),
      description: "This is another task",
    },
  ]);

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      status: taskData.status || "todo",
    };

    if (newTask.title.length > 100) {
      // return false if 'addTask' fails
      alert("Task title too long!");
      return false;
    }

    setTasks((prevTasks) => [...prevTasks, newTask]);
    return true;
  }, []);

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        )
      );
    },
    [tasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const target = tasks.find((task) => task.id === id);
      if (!target) {
        window.alert("Task doesn't exist");
        return false;
      }
      if (!window.confirm(`Delete task "${target.title}"?`)) return false;
      // const index = tasks.findIndex((task) => task.id === id);
      // if (index !== -1) {
      //   tasks.splice(index, 1);
      //   setTasks([...tasks]);
      // }
      // use 'tasks.filter' instead of mutating 'tasks' directly
      setTasks(tasks.filter((task) => task.id !== id));
      return true;
    },
    [tasks]
  );

  const filterTasks = useCallback(
    (status?: Task["status"], priority?: Task["priority"]) => {
      return tasks.filter(
        (task) =>
          (!status || task.status === status) &&
          (!priority || task.priority === priority)
      );
    },
    [tasks]
  );

  const contextValue = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      filterTasks,
    }),
    [tasks, addTask, updateTask, deleteTask, filterTasks]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
