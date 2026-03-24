import { useState, useRef, useCallback } from 'react'
import type { Task, Status } from '../types'

interface DragState {
    taskId: string
    sourceColumn: Status
    cardWidth: number
    cardHeight: number
    offsetX: number
    offsetY: number
}

export function useDragAndDrop(onDrop: (taskId: string, newStatus: Status) => void) {
    const [draggingTask, setDraggingTask] = useState<DragState | null>(null)
    const [overColumn, setOverColumn] = useState<Status | null>(null)
    const columnRefs = useRef<Partial<Record<Status, HTMLDivElement | null>>>({})
    const ghostRef = useRef<HTMLDivElement | null>(null)
    const dragStateRef = useRef<DragState | null>(null)
    const overColumnRef = useRef<Status | null>(null)

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!dragStateRef.current || !ghostRef.current) return

        const x = e.clientX - dragStateRef.current.offsetX
        const y = e.clientY - dragStateRef.current.offsetY

        ghostRef.current.style.transform = `translate(${x}px, ${y}px) rotate(2deg)`

        let found: Status | null = null
        for (const [status, el] of Object.entries(columnRefs.current)) {
            if (!el) continue
            const rect = el.getBoundingClientRect()
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                found = status as Status
                break
            }
        }

        if (found !== overColumnRef.current) {
            if (overColumnRef.current && columnRefs.current[overColumnRef.current]) {
                columnRefs.current[overColumnRef.current]?.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-300')
            }

            if (found && columnRefs.current[found]) {
                columnRefs.current[found]?.classList.add('bg-blue-50', 'ring-2', 'ring-blue-300')
            }
            overColumnRef.current = found

        }
    }, [])

    const onPointerUp = useCallback(() => {
        if (!dragStateRef.current) return

        if (overColumnRef.current && columnRefs.current[overColumnRef.current]) {
            columnRefs.current[overColumnRef.current]?.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-300')
        }

        if (overColumnRef.current && overColumnRef.current !== dragStateRef.current.sourceColumn) {
            onDrop(dragStateRef.current.taskId, overColumnRef.current)
        }

        dragStateRef.current = null
        overColumnRef.current = null
        setDraggingTask(null)
        setOverColumn(null)

        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
    }, [onDrop, onPointerMove])

    const startDrag = useCallback((e: React.PointerEvent, task: Task) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        const state: DragState = {
            taskId: task.id,
            sourceColumn: task.status,
            cardWidth: rect.width,
            cardHeight: rect.height,
            offsetX,
            offsetY,
        }

        dragStateRef.current = state
        setDraggingTask(state)

        if (ghostRef.current) {
            const x = e.clientX - offsetX
            const y = e.clientY - offsetY
            ghostRef.current.style.transform = `translate(${x}px, ${y}px) rotate(2deg)`
        }

        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp, { once: true })
    }, [onPointerMove, onPointerUp])

    return {
        draggingTask,
        overColumn,
        columnRefs,
        ghostRef,
        startDrag,
    }
}