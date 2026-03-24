import { useRef, useState, useCallback, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import PriorityBadge from '../shared/PriorityBadge'
import Avatar from '../shared/Avatar'
import { isOverdue, isDueToday, formatDate, daysOverdue } from '../../utils/dateUtils'
import type { Task, Status } from '../../types'
import { useFilteredTasks } from '../../hooks/useFilterTask'

const ROW_HEIGHT = 56
const BUFFER = 5

type SortKey = 'title' | 'priority' | 'dueDate'
type SortDir = 'asc' | 'desc'

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }

const statusOptions: Status[] = ['todo', 'in-progress', 'in-review', 'done']

function sortTasks(tasks: Task[], key: SortKey, dir: SortDir) {
    return [...tasks].sort((a, b) => {
        let val = 0
        if (key === 'title') val = a.title.localeCompare(b.title)
        if (key === 'priority') val = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (key === 'dueDate') val = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        return dir === 'asc' ? val : -val
    })
}

function getDueDateDisplay(task: Task) {
    if (task.status === 'done') return { label: 'Completed', className: 'text-gray-400' }
    if (isDueToday(task.dueDate)) return { label: 'Due Today', className: 'text-orange-500 font-medium' }
    if (isOverdue(task.dueDate)) return { label: `${daysOverdue(task.dueDate)}d overdue`, className: 'text-red-500 font-medium' }
    return { label: formatDate(task.dueDate), className: 'text-gray-500' }
}

export default function ListView() {
    const { dispatch } = useApp()
    const filteredTasks = useFilteredTasks()
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [containerHeight, setContainerHeight] = useState(600)
    const [sortKey, setSortKey] = useState<SortKey>('dueDate')
    const [sortDir, setSortDir] = useState<SortDir>('asc')

    const sorted = sortTasks(filteredTasks, sortKey, sortDir)
    const totalHeight = sorted.length * ROW_HEIGHT

    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)
    const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER * 2
    const endIndex = Math.min(sorted.length, startIndex + visibleCount)
    const visibleTasks = sorted.slice(startIndex, endIndex)

    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(entries => {
            setContainerHeight(entries[0].contentRect.height)
        })
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
    }, [])

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    function handleStatusChange(taskId: string, newStatus: Status) {
        dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, newStatus } })
    }

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
        return <span className="text-blue-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">

            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">
                <button className="text-left flex items-center" onClick={() => handleSort('title')}>
                    Title <SortIcon col="title" />
                </button>
                <button className="text-left flex items-center" onClick={() => handleSort('priority')}>
                    Priority <SortIcon col="priority" />
                </button>
                <span>Assignee</span>
                <span>Status</span>
                <button className="text-left flex items-center" onClick={() => handleSort('dueDate')}>
                    Due Date <SortIcon col="dueDate" />
                </button>
            </div>

            <div
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 overflow-y-auto"
            >
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-20">
                        <span className="text-4xl">🔍</span>
                        <p className="font-medium">No tasks match your filters</p>
                        <button
                            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
                            className="text-sm text-blue-500 underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div style={{ height: totalHeight, position: 'relative' }}>
                        {visibleTasks.map((task, i) => {
                            const due = getDueDateDisplay(task)
                            const top = (startIndex + i) * ROW_HEIGHT
                            const overdue = isOverdue(task.dueDate) && task.status !== 'done'

                            return (
                                <div
                                    key={task.id}
                                    style={{ position: 'absolute', top, left: 0, right: 0, height: ROW_HEIGHT }}
                                    className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50' : ''}`}
                                >
                                    <span className="text-sm text-gray-800 truncate">{task.title}</span>
                                    <PriorityBadge priority={task.priority} />
                                    <div className="flex items-center gap-1.5">
                                        <Avatar user={task.assignee} />
                                        <span className="text-xs text-gray-600 truncate">{task.assignee.name.split(' ')[0]}</span>
                                    </div>
                                    <select
                                        value={task.status}
                                        onChange={e => handleStatusChange(task.id, e.target.value as Status)}
                                        className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-700 cursor-pointer"
                                    >
                                        {statusOptions.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <span className={`text-xs ${due.className}`}>{due.label}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="px-4 py-1.5 border-t border-gray-100 text-xs text-gray-400 shrink-0">
                {sorted.length} tasks · showing {startIndex + 1}–{Math.min(endIndex, sorted.length)}
            </div>
        </div>
    )
}