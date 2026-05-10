'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'

const initialTodos = [
  { id: 1, task: 'Process customer feedback', agent: 'Agent Alpha', done: true },
  { id: 2, task: 'Generate weekly report', agent: 'Agent Beta', done: false },
  { id: 3, task: 'Update documentation', agent: 'Agent Gamma', done: false },
  { id: 4, task: 'Deploy new features', agent: 'Agent Delta', done: true },
  { id: 5, task: 'Monitor system health', agent: 'Agent Epsilon', done: false },
]

export function TodoList() {
  const [todos, setTodos] = useState(initialTodos)

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  const completedCount = todos.filter((t) => t.done).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {completedCount} of {todos.length} completed
        </span>
        <div className="h-2 bg-gray-200 dark:bg-dark-600 rounded-full flex-1 ml-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
            style={{ width: `${(completedCount / todos.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors cursor-pointer group"
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.done ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 group-hover:text-primary-500" />
            )}

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  todo.done
                    ? 'line-through text-gray-500 dark:text-gray-600'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {todo.task}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                {todo.agent}
              </p>
            </div>

            {todo.done && <span className="text-xs font-bold text-green-500">Done</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
