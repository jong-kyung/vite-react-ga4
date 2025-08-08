import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Todo = {
  id: string
  title: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todo-app:v1'

function useLocalStorageTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Todo[]
      if (!Array.isArray(parsed)) return []
      return parsed
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  return { todos, setTodos }
}

function newId() {
  // Simple unique-ish id for demo purposes
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function App() {
  const { todos, setTodos } = useLocalStorageTodos()
  const [filter, setFilter] = useState<Filter>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed)
      case 'completed':
        return todos.filter(t => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const itemsLeft = useMemo(() => todos.filter(t => !t.completed).length, [todos])

  function addTodo(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return
    setTodos(prev => [{ id: newId(), title: trimmed, completed: false }, ...prev])
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function removeTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function editTodo(id: string, title: string) {
    const trimmed = title.trim()
    if (!trimmed) {
      // If empty after edit, remove it
      removeTodo(id)
      return
    }
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, title: trimmed } : t)))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = (formData.get('title') as string) || ''
    addTodo(title)
    form.reset()
    inputRef.current?.focus()
  }

  return (
    <main className="app">
      <h1>TODO</h1>

      <form onSubmit={handleSubmit} className="todo-form" autoComplete="off" aria-label="Add a todo">
        <input ref={inputRef} name="title" type="text" placeholder="What needs to be done?" aria-label="Todo title" />
        <button type="submit" className="primary">Add</button>
      </form>

      <section className="controls" aria-label="Filters and actions">
        <div className="filters" role="tablist" aria-label="Filter todos">
          {(['all', 'active', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              className={`filter ${filter === f ? 'active' : ''}`}
              data-filter={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="actions">
          <button onClick={clearCompleted} className="ghost">Clear completed</button>
        </div>
      </section>

      <ul className="todo-list" aria-live="polite" aria-label="Todo list">
        {filtered.length === 0 && (
          <li className="empty">No todos</li>
        )}
        {filtered.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => removeTodo(todo.id)}
            onEdit={(title) => editTodo(todo.id, title)}
          />
        ))}
      </ul>

      <footer className="status" aria-live="polite">
        <span>{itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left</span>
      </footer>
    </main>
  )
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onEdit: (title: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setTitle(todo.title)
  }, [todo.title])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onEdit(title)
    setEditing(false)
  }

  return (
    <li className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="toggle">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} />
        <span className="checkmark" aria-hidden />
      </label>

      {!editing ? (
        <>
          <span className="title" onDoubleClick={() => setEditing(true)}>
            {todo.title}
          </span>
          <div className="item-actions">
            <button className="ghost" onClick={() => setEditing(true)} aria-label="Edit">Edit</button>
            <button className="danger" onClick={onDelete} aria-label="Delete">Delete</button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            ref={inputRef}
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => {
              // Commit on blur as well
              onEdit(e.target.value)
              setEditing(false)
            }}
          />
          <button type="submit" className="primary small">Save</button>
        </form>
      )}
    </li>
  )
}

export default App
