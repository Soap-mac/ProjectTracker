import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { reducer, initialState } from './reducer'
import type { AppState, AppAction } from '../types'

interface ContextValue {
    state: AppState
    dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<ContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used inside AppProvider')
    return context
}