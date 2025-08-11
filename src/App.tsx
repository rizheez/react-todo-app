import { useState, useEffect } from "react";
import { type Todo } from "./types";
import { motion, AnimatePresence } from "framer-motion";

type Filter = "all" | "active" | "completed";

function App() {
  // const [count, setCount] = useState(0)
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

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
    localStorage.setItem("todos", JSON.stringify(todos));
    console.log(todos);
  }, [todos]);
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };
  const saveEdit = (id: number) => {
    if (!editingText.trim()) return;
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editingText } : todo)));
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 ">
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
          <div className="flex gap-2 mb-4">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded capitalize ${
                  filter === f
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 hover:bg-blue-300"
                }`}
                onClick={() => setFilter(f as Filter)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <button onClick={clearCompleted} className="text-sm text-red-500 hover:text-red-600">
              🗑️Clear Completed
            </button>
          </div>
          {/* list */}
          <ul className="space-y-2">
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <motion.li
                  key={todo.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between transition-all duration-200 bg-gray-50 p-3 rounded-lg hover:bg-gray-200"
                >
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                      className="flex-1 border rounded px-2 mr-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className={todo.completed ? "line-through text-gray-400" : ""}>
                        {todo.text}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editingId !== todo.id && (
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        ✏
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      ✖
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
