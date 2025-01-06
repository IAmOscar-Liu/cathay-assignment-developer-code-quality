// TODO: create a form to add new task
import { FormEvent, useReducer } from "react";
import { Task } from "../types/task";
import { useTasks } from "../context/TaskContext";

// Define the shape of the state
type FormState = Omit<Task, "id" | "createdAt">;

// Define action types
type FormAction =
  | { type: "title"; payload: Task["title"] }
  | { type: "status"; payload: Task["status"] }
  | { type: "priority"; payload: Task["priority"] }
  | { type: "description"; payload: Task["description"] }
  | { type: "reset" };

const formReducer = (state: FormState, action: FormAction): FormState => {
  if (action.type === "reset") return INITIAL_FORM_DATA;
  return {
    ...state,
    [action.type]: action.payload,
  };
};

const INITIAL_FORM_DATA: FormState = {
  title: "",
  status: "todo",
  priority: "low",
  description: "",
};

export const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  // I prefer 'useReducer' over 'useState' because you don't have to set 4 state variables, and it's easy to reset all fields.
  const [state, dispatch] = useReducer(formReducer, INITIAL_FORM_DATA);

  const handleSubmission = (e: FormEvent) => {
    e.preventDefault();
    if (addTask(state)) dispatch({ type: "reset" });
  };

  return (
    <form className="px-2" onSubmit={handleSubmission}>
      <h1 className="text-xl font-bold my-3">New Task</h1>
      <div className="ms-1 space-y-2">
        <div className="flex gap-2 items-start">
          <label htmlFor="title">Title </label>
          <input
            required
            id="title"
            className="py-0.5 px-1 border-[1px] border-black rounded-md w-40"
            value={state.title}
            onChange={(e) =>
              dispatch({ type: "title", payload: e.target.value })
            }
          />
        </div>
        <div className="flex gap-2 items-start">
          <label htmlFor="status">Status </label>
          <select
            id="status"
            value={state.status}
            className="py-0.5 px-1 border-[1px] border-black rounded-md w-40"
            onChange={(e) =>
              dispatch({
                type: "status",
                payload: e.target.value as Task["status"],
              })
            }
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex gap-2 items-start">
          <label htmlFor="priority">Priority </label>
          <select
            id="priority"
            value={state.priority}
            className="py-0.5 px-1 border-[1px] border-black rounded-md w-40"
            onChange={(e) =>
              dispatch({
                type: "priority",
                payload: e.target.value as Task["priority"],
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-2 items-start">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="py-0.5 px-1 border-[1px] border-black rounded-md w-40"
            value={state.description}
            onChange={(e) =>
              dispatch({ type: "description", payload: e.target.value })
            }
          ></textarea>
        </div>
      </div>
      <button className="ms-1 bg-black text-white rounded-md px-4 py-1 text-sm">
        Submit
      </button>
    </form>
  );
};
