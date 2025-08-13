import { useEffect, useRef, useState } from "react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (title: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onEdit(title);
    setEditing(false);
  }

  return (
    <li className={`todo ${todo.completed ? "completed" : ""}`}>
      <label className='toggle'>
        <input type='checkbox' checked={todo.completed} onChange={onToggle} />
        <span className='checkmark' aria-hidden />
      </label>

      {!editing ? (
        <>
          <span className='title' onDoubleClick={() => setEditing(true)}>
            {todo.title}
          </span>
          <div className='item-actions'>
            <button className='ghost' onClick={() => setEditing(true)} aria-label='Edit'>
              Edit
            </button>
            <button className='danger' onClick={onDelete} aria-label='Delete'>
              Delete
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className='edit-form'>
          <input
            ref={inputRef}
            className='edit-input'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => {
              onEdit(e.target.value);
              setEditing(false);
            }}
          />
          <button type='submit' className='primary small'>
            Save
          </button>
        </form>
      )}
    </li>
  );
};

TodoItem.displayName = "TodoItem";

export default TodoItem;
