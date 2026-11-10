export type Priority = 'High' | 'Medium' | 'Low'

export type Category = 'work' | 'personal' | 'health' | 'learning'

export type RepeatType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'weekly-x'
  | 'monthly'
  | 'every-n-days'

export type DayPeriod = 'AM' | 'PM'

export type Screen = 'home' | 'weekly' | 'monthly'

export type TaskSortOption =
  | 'due-asc'
  | 'due-desc'
  | 'priority-asc'
  | 'priority-desc'
  | 'title-asc'
  | 'title-desc'
  | 'effort-asc'
  | 'effort-desc'
  | 'difficulty-asc'
  | 'difficulty-desc'

export interface RepeatOptions {
  repeatType?: RepeatType
  repeatWeekDays?: number[]
  repeatEveryNDays?: number
  repeatEndDate?: string | null
}

export interface Task extends RepeatOptions {
  id: number
  title: string
  notes: string
  completed: boolean
  priority: Priority
  due: string
  estimatedMinutes: number
  difficulty: number
  category: Category
}

export type TaskInput = Omit<Task, 'id' | 'completed'>
export type TaskUpdates = Partial<TaskInput>

export interface CalendarEvent extends RepeatOptions {
  id: number
  title: string
  notes: string
  date: string
  startHour: string
  startMinute: string
  startPeriod: DayPeriod
  endHour: string
  endMinute: string
  endPeriod: DayPeriod
  location: string
  category: Category
}

export type EventInput = Omit<CalendarEvent, 'id'>
export type EventUpdates = Partial<EventInput>

export interface TaskForm {
  title: string
  notes: string
  priority: Priority
  dueDate: string
  dueTimeHour: string
  dueTimeMinute: string
  dueTimePeriod: DayPeriod
  estimatedMinutes: string
  difficulty: string
  category: Category
  repeatType: RepeatType
  repeatWeekDays: number[]
  repeatEveryNDays: string
  repeatEndDate: string
}

export interface EventForm {
  title: string
  notes: string
  date: string
  category: Category
  startHour: string
  startMinute: string
  startPeriod: DayPeriod
  endHour: string
  endMinute: string
  endPeriod: DayPeriod
  location: string
  repeatType: RepeatType
  repeatWeekDays: number[]
  repeatEveryNDays: string
  repeatEndDate: string
}
