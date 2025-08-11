import { useState, useEffect } from "react";
import { type Todo } from "./types";

type Filter = "all" | "active" | "completed";

function App() {
  // const [count, setCount] = useState(0)
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const addTodo = () => {
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setText("");
  };

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Todo App</h1>

          {/* input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new task"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focusborder-blue-500"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add
            </button>
          </div>
          {/* filter */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg  ${
                filter === "all"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded-lg ${
                filter === "active"
                  ? "bg-blue-500  hover:bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded ${
                filter === "completed"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Completed
            </button>
          </div>
          {/* list */}
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between transition-all duration-200 bg-gray-50 p-3 rounded-lg hover:bg-gray-200"
              >
                <span
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-1 cursor-pointer ${
                    todo.completed ? "line-through text-gray-500" : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
