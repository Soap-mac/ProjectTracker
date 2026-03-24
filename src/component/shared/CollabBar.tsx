import { useCollaboration } from '../../hooks/useCollaboration'
import Avatar from './Avatar'

export default function CollabBar() {
    const collaborators = useCollaboration()

    if (collaborators.length === 0) return null

    const visible = collaborators.slice(0, 3)
    const extra = collaborators.length - visible.length

    return (
        <div className="flex items-center gap-2 bg-blue-50 border-b border-blue-100 px-4 py-1.5 shrink-0">
            <div className="flex items-center -space-x-2">
                {visible.map((c, i) => (
                    <div key={i} style={{ zIndex: visible.length - i }}>
                        <Avatar user={c.user} size="sm" />
                    </div>
                ))}
                {extra > 0 && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium">
                        +{extra}
                    </div>
                )}
            </div>
            <span className="text-xs text-blue-600 font-medium">
                {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'} viewing this board
            </span>
        </div>
    )
}