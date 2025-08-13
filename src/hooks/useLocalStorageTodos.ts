import { useEffect, useState } from "react";
import type { Todo } from "../types";
import { STORAGE_KEY } from "../constants";

function useLocalStorageTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: Todo[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  return { todos, setTodos };
}

export default useLocalStorageTodos;
