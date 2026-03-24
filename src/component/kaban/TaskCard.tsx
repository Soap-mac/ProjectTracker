import { useApp } from '../../context/AppContext'
import type { Task } from '../../types'
import PriorityBadge from '../shared/PriorityBadge'
import Avatar from '../shared/Avatar'
import { isOverdue, isDueToday, isOverdueBySeven, formatDate, daysOverdue } from '../../utils/dateUtils'

interface Props {
    task: Task
}

export default function TaskCard({ task }: Props) {
    const { state } = useApp()
    const overdue = isOverdue(task.dueDate)
    const today = isDueToday(task.dueDate)
    const veryOverdue = isOverdueBySeven(task.dueDate)

    // find collaborators viewing this card
    const viewers = state.collaborators.filter(c => c.taskId === task.id)

    function getDueDateDisplay() {
        if (task.status === 'done') return 'Completed'
        if (today) return 'Due Today'
        if (veryOverdue) return `${daysOverdue(task.dueDate)}d overdue`
        return formatDate(task.dueDate)
    }

    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col gap-2 cursor-grab active:cursor-grabbing relative">

            {/* collab viewer avatars */}
            {viewers.length > 0 && (
                <div className="absolute -top-2 -right-2 flex -space-x-1">
                    {viewers.slice(0, 2).map((v, i) => (
                        <div key={i} className="ring-2 ring-white rounded-full">
                            <Avatar user={v.user} size="sm" />
                        </div>
                    ))}
                    {viewers.length > 2 && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 ring-2 ring-white flex items-center justify-center text-xs font-medium">
                            +{viewers.length - 2}
                        </div>
                    )}
                </div>
            )}

            <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
            <PriorityBadge priority={task.priority} />

            <div className="flex items-center justify-between mt-1">
                <Avatar user={task.assignee} />
                <span className={`text-xs ${overdue && task.status !== 'done' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                    {getDueDateDisplay()}
                </span>
            </div>
        </div>
    )
}