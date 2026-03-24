import type { Task, Status } from '../../types'
import TaskCard from './TaskCard'

const columnStyles: Record<Status, string> = {
    'todo': 'border-t-gray-400',
    'in-progress': 'border-t-blue-400',
    'in-review': 'border-t-yellow-400',
    'done': 'border-t-green-400',
}

interface Props {
    id: Status
    title: string
    tasks: Task[]
    isDraggingOver: boolean
    draggingTaskId: string | null
    colRef: (el: HTMLDivElement | null) => void
    onStartDrag: (e: React.PointerEvent, task: Task) => void
}

export default function KanbanColumn({ id, title, tasks, draggingTaskId, colRef, onStartDrag }: Props) {
    return (
        <div
            ref={colRef}
            className={`bg-gray-50 rounded-lg flex flex-col border-t-4 ${columnStyles[id]} min-w-[260px] max-w-[260px] transition-colors`}
        >
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{tasks.length}</span>
            </div>

            <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1 min-h-[200px]">
                {tasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-400 py-8">
                        No tasks here
                    </div>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task.id}
                            onPointerDown={e => onStartDrag(e, task)}
                            style={{ opacity: draggingTaskId === task.id ? 0.3 : 1 }}
                        >
                            <TaskCard task={task} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}