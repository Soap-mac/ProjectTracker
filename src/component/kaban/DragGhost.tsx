import type { Task } from '../../types'
import PriorityBadge from '../shared/PriorityBadge'
import { forwardRef } from 'react'

interface Props {
    task: Task
    width: number
    height: number
}

const DragGhost = forwardRef<HTMLDivElement, Props>(({ task, width, height }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width,
                height,
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: 0.9,
                transform: 'translate(0px, 0px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                willChange: 'transform',
            }}
            className="bg-white rounded-lg p-3 border border-blue-400 flex flex-col gap-2"
        >
            <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
            <PriorityBadge priority={task.priority} />
        </div>
    )
})

export default DragGhost