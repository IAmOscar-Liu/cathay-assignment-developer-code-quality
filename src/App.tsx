import React from "react";
import { TaskProvider } from "./context/TaskContext";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";

const App: React.FC = () => {
  return (
    <TaskProvider>
      <div>
        {/* Add some margin and padding to make it look better */}
        <h1 className="ms-2 mt-1">Task Management App</h1>
        {/*for add task*/}
        <TaskForm />
        <TaskList />
      </div>
    </TaskProvider>
  );
};

export default App;
