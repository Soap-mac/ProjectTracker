export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface User {
  id: string
  name: string
  initials: string
  colour: string
}

export interface Task {
  id: string
  title: string
  status: Status
  priority: Priority
  assignee: User
  startDate: string | null
  dueDate: string
  createdAt: string
}

export interface Column {
  id: Status
  title: string
}

export interface Filters {
  status: Status[]
  priority: Priority[]
  assignee: string[]
  dueDateFrom: string | null
  dueDateTo: string | null
}

export interface ActiveIndicator {
  user: User
  taskId: string
}

export interface AppState {
  tasks: Task[]
  filters: Filters
  activeView: 'kanban' | 'list' | 'timeline'
  collaborators: ActiveIndicator[]
}

export type AppAction =
  | { type: 'SET_VIEW'; payload: AppState['activeView'] }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: Status } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; newStatus: Status } }
  | { type: 'SET_FILTER'; payload: Partial<Filters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_COLLABORATORS'; payload: ActiveIndicator[] }