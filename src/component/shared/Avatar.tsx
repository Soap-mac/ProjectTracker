import type { User } from '../../types'

export default function Avatar({ user, size = 'sm' }: { user: User; size?: 'sm' | 'md' }) {
    const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
    return (
        <div className={`${user.colour} ${sizeClass} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
            {user.initials}
        </div>
    )
}