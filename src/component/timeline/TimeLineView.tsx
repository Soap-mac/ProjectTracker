import { useRef, useState, useCallback, useEffect } from 'react'
import { isOverdue } from '../../utils/dateUtils'
import { useFilteredTasks } from '../../hooks/useFilterTask'

const ROW_HEIGHT = 40
const LABEL_WIDTH = 200
const DAY_WIDTH = 40
const BUFFER = 3

const priorityColours: Record<string, string> = {
    critical: 'bg-red-400',
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-400',
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}


export default function TimelineView() {
    // const { state } = useApp()
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [containerHeight, setContainerHeight] = useState(600)
    const filteredTasks = useFilteredTasks()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const today = now.getDate()

    const tasks = filteredTasks
    const totalHeight = tasks.length * ROW_HEIGHT

    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)
    const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER * 2
    const endIndex = Math.min(tasks.length, startIndex + visibleCount)
    const visibleTasks = tasks.slice(startIndex, endIndex)

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

    function getBarStyle(task: typeof tasks[0]) {
        const start = task.startDate ? new Date(task.startDate) : new Date(task.dueDate)
        const end = new Date(task.dueDate)

        const monthStart = new Date(year, month, 1)
        const monthEnd = new Date(year, month, daysInMonth)

        const clippedStart = start < monthStart ? monthStart : start
        const clippedEnd = end > monthEnd ? monthEnd : end

        if (clippedEnd < monthStart || clippedStart > monthEnd) return null

        const startDay = clippedStart.getDate() - 1
        const endDay = clippedEnd.getDate()
        const width = (endDay - startDay) * DAY_WIDTH
        const left = startDay * DAY_WIDTH

        return { left, width: Math.max(width, DAY_WIDTH) }
    }

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' })

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">

            <div className="flex shrink-0 border-b border-gray-200">
                <div style={{ minWidth: LABEL_WIDTH }} className="px-3 py-2 font-semibold text-sm text-gray-700 border-r border-gray-200">
                    {monthName}
                </div>
                <div className="overflow-hidden flex">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <div
                            key={day}
                            style={{ minWidth: DAY_WIDTH }}
                            className={`text-center text-xs py-2 border-r border-gray-100 font-medium
                ${day === today ? 'text-blue-600 font-bold' : 'text-gray-400'}
              `}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 overflow-auto"
            >
                <div style={{ height: totalHeight, position: 'relative' }}>
                    {visibleTasks.map((task, i) => {
                        const barStyle = getBarStyle(task)
                        const top = (startIndex + i) * ROW_HEIGHT
                        const overdue = isOverdue(task.dueDate) && task.status !== 'done'

                        return (
                            <div
                                key={task.id}
                                style={{ position: 'absolute', top, left: 0, right: 0, height: ROW_HEIGHT }}
                                className="flex border-b border-gray-100 hover:bg-gray-50"
                            >
                                <div
                                    style={{ minWidth: LABEL_WIDTH }}
                                    className="flex items-center px-3 border-r border-gray-200 gap-2"
                                >
                                    <span className={`text-xs truncate ${overdue ? 'text-red-500' : 'text-gray-700'}`}>
                                        {task.title}
                                    </span>
                                </div>

                                <div className="relative flex-1 flex items-center">

                                    <div
                                        style={{ left: (today - 1) * DAY_WIDTH + DAY_WIDTH / 2, position: 'absolute', top: 0, bottom: 0, width: 1 }}
                                        className="bg-blue-400 opacity-40 z-10"
                                    />

                                    {Array.from({ length: daysInMonth }, (_, i) => i).map(d => (
                                        <div
                                            key={d}
                                            style={{ position: 'absolute', left: d * DAY_WIDTH, top: 0, bottom: 0, width: 1 }}
                                            className="bg-gray-100"
                                        />
                                    ))}

                                    {barStyle && (
                                        <div
                                            style={{ position: 'absolute', left: barStyle.left, width: barStyle.width, height: 20 }}
                                            className={`${priorityColours[task.priority]} rounded-full opacity-80 flex items-center px-2`}
                                            title={task.title}
                                        >
                                            <span className="text-white text-xs truncate">{task.title}</span>
                                        </div>
                                    )}

                                    {!task.startDate && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: (new Date(task.dueDate).getDate() - 1) * DAY_WIDTH + DAY_WIDTH / 2 - 4,
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                            }}
                                            className={`${priorityColours[task.priority]}`}
                                            title={`${task.title} (no start date)`}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="px-4 py-1.5 border-t border-gray-100 text-xs text-gray-400 shrink-0">
                {tasks.length} tasks · scroll to see all
            </div>
        </div>
    )
}