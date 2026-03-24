import type { Priority } from '../../types'

const colours: Record<Priority, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${colours[priority]}`}>
      {priority}
    </span>
  )
}