import { useApp } from '../context/AppContext'

export function useFilteredTasks() {
  const { state } = useApp()
  const { tasks, filters } = state

  return tasks.filter(task => {
    if (filters.status.length && !filters.status.includes(task.status)) return false
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false
    if (filters.assignee.length && !filters.assignee.includes(task.assignee.id)) return false
    if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) return false
    if (filters.dueDateTo && task.dueDate > filters.dueDateTo) return false
    return true
  })
}