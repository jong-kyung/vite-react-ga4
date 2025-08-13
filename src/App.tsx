import { useMemo, useRef, useState } from "react";
import "./App.css";
import useLocalStorageTodos from "./hooks/useLocalStorageTodos";
import type { Filter } from "./types";
import { newId } from "./utils";
import TodoItem from "./components/TodoItem";

function App() {
  const { todos, setTodos } = useLocalStorageTodos();
  const [filter, setFilter] = useState<Filter>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const itemsLeft = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  const addTodo = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [{ id: newId(), title: trimmed, completed: false }, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      // If empty after edit, remove it
      removeTodo(id);
      return;
    }
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
  };

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string) || "";
    addTodo(title);
    form.reset();
    inputRef.current?.focus();
  }

  return (
    <main className='app'>
      <h1>TODO</h1>

      <form onSubmit={handleSubmit} className='todo-form' autoComplete='off' aria-label='Add a todo'>
        <input ref={inputRef} name='title' type='text' placeholder='What needs to be done?' aria-label='Todo title' />
        <button type='submit' className='primary'>
          Add
        </button>
      </form>

      <section className='controls' aria-label='Filters and actions'>
        <div className='filters' role='tablist' aria-label='Filter todos'>
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`filter ${filter === f ? "active" : ""}`}
              data-filter={f}
              role='tab'
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className='actions'>
          <button onClick={clearCompleted} className='ghost'>
            Clear completed
          </button>
        </div>
      </section>

      <ul className='todo-list' aria-live='polite' aria-label='Todo list'>
        {filtered.length === 0 && <li className='empty'>No todos</li>}
        {filtered.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => removeTodo(todo.id)}
            onEdit={(title) => editTodo(todo.id, title)}
          />
        ))}
      </ul>

      <footer className='status' aria-live='polite'>
        <span>
          {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
        </span>
      </footer>
    </main>
  );
}

export default App;
