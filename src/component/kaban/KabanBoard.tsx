import { useApp } from '../../context/AppContext'
import KanbanColumn from './KabanColumn'
import DragGhost from './DragGhost'
import { useDragAndDrop } from '../../hooks/dragAndDrop'
import type { Column, Status } from '../../types'
import { useFilteredTasks } from '../../hooks/useFilterTask'

const columns: Column[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'in-review', title: 'In Review' },
    { id: 'done', title: 'Done' },
]

export default function KanbanBoard() {
    const { dispatch } = useApp();
    const filteredTasks = useFilteredTasks()

    function handleDrop(taskId: string, newStatus: Status) {
        dispatch({ type: 'MOVE_TASK', payload: { taskId, newStatus } })
    }

    const { draggingTask, overColumn, columnRefs, ghostRef, startDrag } = useDragAndDrop(handleDrop)

    const draggedTask = draggingTask
        ? filteredTasks.find(t => t.id === draggingTask.taskId)
        : null

    return (
        <div
            className="grid md:grid-cols-4 gap-6 overflow-x-auto pb-4 h-full px-5"
            style={{ touchAction: 'none', userSelect: 'none' }}
        >
            {columns.map(col => (
                <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    tasks={filteredTasks.filter(t => t.status === col.id)
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    }
                    isDraggingOver={overColumn === col.id}
                    draggingTaskId={draggingTask?.taskId ?? null}
                    colRef={el => { columnRefs.current[col.id] = el }}
                    onStartDrag={startDrag}
                />
            ))}

            {draggingTask && draggedTask && (
                <DragGhost
                    ref={ghostRef}
                    task={draggedTask}
                    width={draggingTask.cardWidth}
                    height={draggingTask.cardHeight}
                />
            )}
        </div>
    )
}
