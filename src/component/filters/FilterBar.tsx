import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { users } from '../../data/seed'
import type { Status, Priority } from '../../types'

const statusOptions: Status[] = ['todo', 'in-progress', 'in-review', 'done']
const priorityOptions: Priority[] = ['critical', 'high', 'medium', 'low']

export default function FilterBar() {
    const { state, dispatch } = useApp()
    const [searchParams, setSearchParams] = useSearchParams()
    const { filters } = state

    useEffect(() => {
        const status = searchParams.getAll('status') as Status[]
        const priority = searchParams.getAll('priority') as Priority[]
        const assignee = searchParams.getAll('assignee')
        const dueDateFrom = searchParams.get('from')
        const dueDateTo = searchParams.get('to')

        if (status.length || priority.length || assignee.length || dueDateFrom || dueDateTo) {
            dispatch({
                type: 'SET_FILTER',
                payload: { status, priority, assignee, dueDateFrom, dueDateTo }
            })
        }
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()

        filters.status.forEach(s => params.append('status', s))
        filters.priority.forEach(p => params.append('priority', p))
        filters.assignee.forEach(a => params.append('assignee', a))
        if (filters.dueDateFrom) params.set('from', filters.dueDateFrom)
        if (filters.dueDateTo) params.set('to', filters.dueDateTo)

        setSearchParams(params, { replace: true })
    }, [filters])

    function toggleStatus(s: Status) {
        const current = filters.status
        const updated = current.includes(s)
            ? current.filter(x => x !== s)
            : [...current, s]
        dispatch({ type: 'SET_FILTER', payload: { status: updated } })
    }

    function togglePriority(p: Priority) {
        const current = filters.priority
        const updated = current.includes(p)
            ? current.filter(x => x !== p)
            : [...current, p]
        dispatch({ type: 'SET_FILTER', payload: { priority: updated } })
    }

    function toggleAssignee(id: string) {
        const current = filters.assignee
        const updated = current.includes(id)
            ? current.filter(x => x !== id)
            : [...current, id]
        dispatch({ type: 'SET_FILTER', payload: { assignee: updated } })
    }

    const hasActiveFilters =
        filters.status.length > 0 ||
        filters.priority.length > 0 ||
        filters.assignee.length > 0 ||
        filters.dueDateFrom !== null ||
        filters.dueDateTo !== null

    return (
        <div className="flex items-center gap-3 flex-wrap bg-white px-4 py-2 border-b border-gray-200 shrink-0">

            <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                {statusOptions.map(s => (
                    <button
                        key={s}
                        onClick={() => toggleStatus(s)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors capitalize ${filters.status.includes(s)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Priority:</span>
                {priorityOptions.map(p => (
                    <button
                        key={p}
                        onClick={() => togglePriority(p)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors capitalize ${filters.priority.includes(p)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Assignee:</span>
                {users.map(u => (
                    <button
                        key={u.id}
                        onClick={() => toggleAssignee(u.id)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${filters.assignee.includes(u.id)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                            }`}
                    >
                        {u.name.split(' ')[0]}
                    </button>
                ))}
            </div>

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">From:</span>
                <input
                    type="date"
                    value={filters.dueDateFrom ?? ''}
                    onChange={e => dispatch({ type: 'SET_FILTER', payload: { dueDateFrom: e.target.value || null } })}
                    className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600"
                />
                <span className="text-xs text-gray-500 font-medium">To:</span>
                <input
                    type="date"
                    value={filters.dueDateTo ?? ''}
                    onChange={e => dispatch({ type: 'SET_FILTER', payload: { dueDateTo: e.target.value || null } })}
                    className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600"
                />
            </div>

            {hasActiveFilters && (
                <button
                    onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
                    className="ml-auto text-xs text-red-500 border border-red-300 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                    Clear filters
                </button>
            )}
        </div>
    )
}