export function isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date(new Date().toDateString())
}

export function isDueToday(dueDate: string): boolean {
    return new Date(dueDate).toDateString() === new Date().toDateString()
}

export function isOverdueBySeven(dueDate: string): boolean {
    const diff = new Date().getTime() - new Date(dueDate).getTime()
    return diff > 7 * 24 * 60 * 60 * 1000
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    })
}

export function daysOverdue(dueDate: string): number {
    const diff = new Date().getTime() - new Date(dueDate).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}