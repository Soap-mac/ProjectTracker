import type { AppState, AppAction, Filters } from '../types'

const defaultFilters: Filters = {
    status: [],
    priority: [],
    assignee: [],
    dueDateFrom: null,
    dueDateTo: null,
}

import { generateTasks } from '../data/seed'

export const initialState: AppState = {
    tasks: generateTasks(500),
    filters: defaultFilters,
    activeView: 'kanban',
    collaborators: [],
}

export function reducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {

        case 'SET_VIEW':
            return { ...state, activeView: action.payload }

        case 'MOVE_TASK':
        case 'UPDATE_TASK_STATUS':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? { ...task, status: action.payload.newStatus }
                        : task
                ),
            }

        case 'SET_FILTER':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
            }

        case 'CLEAR_FILTERS':
            return { ...state, filters: defaultFilters }

        case 'SET_COLLABORATORS':
            return { ...state, collaborators: action.payload }

        default:
            return state
    }
}