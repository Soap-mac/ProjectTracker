import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { users } from '../data/seed'
import type { ActiveIndicator } from '../types'

const collabUsers = users.slice(0, 4)

export function useCollaboration() {
    const { state, dispatch } = useApp()

    useEffect(() => {
        function moveUsers() {
            const taskIds = state.tasks.map(t => t.id)

            const indicators: ActiveIndicator[] = collabUsers.map(user => ({
                user,
                taskId: taskIds[Math.floor(Math.random() * taskIds.length)],
            }))

            dispatch({ type: 'SET_COLLABORATORS', payload: indicators })
        }

        moveUsers()
        const interval = setInterval(moveUsers, 3000)
        return () => clearInterval(interval)
    }, [state.tasks.length])

    return state.collaborators
}