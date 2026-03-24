import type { Task, User, Priority, Status } from '../types'

const users: User[] = [
    { id: 'u1', name: 'Arpit Mishra', initials: 'AM', colour: 'bg-violet-500' },
    { id: 'u2', name: 'Ayush Jha', initials: 'AJ', colour: 'bg-blue-500' },
    { id: 'u3', name: 'Mehul', initials: 'M', colour: 'bg-emerald-500' },
    { id: 'u4', name: 'Om Aditya', initials: 'OA', colour: 'bg-orange-500' },
    { id: 'u5', name: 'Chinmay Agarwal', initials: 'CA', colour: 'bg-pink-500' },
    { id: 'u6', name: 'Cristiano Ronaldo', initials: 'CR', colour: 'bg-yellow-500' },
]

const priorities: Priority[] = ['critical', 'high', 'medium', 'low']
const statuses: Status[] = ['todo', 'in-progress', 'in-review', 'done']

const taskTitles = [
    'Complete the login auth',
    'Study DSA',
    'Play Cricket With Friends',
    'Build the PC',
    'Push Project Code To GitHub',
    'Make the Login Page Responsive',
    'Make Login Route',
    'Study for test',
    'Create READme for Project',
    'Get 8 hrs of Sleep',
    'Go to the classes',
    'create register route',
    'test the login page',
    'test the register page',
    'check the mails',
    'Reply to important mails',
    'go to the movie',
    'play online video games',
    'Study computer networking',
    'record the guitar',
    'Repair the laptop',
    'Go to Picnic',
    'Chat with friends',
    'Study Operating System',
    'Book train tickets',
    'complete the project',
    'schedule the meeting',
    'repair the phone',
    'go to the village',
    'add new features to the project',
]

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateDate(daysFromNow: number): string {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString().split('T')[0]
}

export function generateTasks(count = 500): Task[] {
    const tasks: Task[] = []

    for (let i = 0; i < count; i++) {
        const titleBase = taskTitles[i % taskTitles.length]
        const suffix = Math.floor(i / taskTitles.length)
        const title = suffix === 0 ? titleBase : `${titleBase} new${suffix + 1}`

        const dueDaysOffset = randomBetween(-15, 30)
        const startDaysOffset = randomBetween(-20, dueDaysOffset - 1)

        const hasStartDate = Math.random() > 0.1

        tasks.push({
            id: `task-${i + 1}`,
            title,
            status: randomItem(statuses),
            priority: randomItem(priorities),
            assignee: randomItem(users),
            startDate: hasStartDate ? generateDate(startDaysOffset) : null,
            dueDate: generateDate(dueDaysOffset),
            createdAt: generateDate(startDaysOffset - randomBetween(1, 5)),
        })
    }

    return tasks
}

export { users }