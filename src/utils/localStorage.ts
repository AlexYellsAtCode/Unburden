import type { CalendarEvent, Category, DayPeriod, Priority, RepeatType, Task } from '../types'

export const TASKS_STORAGE_KEY = 'planaware_tasks'
export const EVENTS_STORAGE_KEY = 'planaware_events'

const priorities = new Set<Priority>(['High', 'Medium', 'Low'])
const categories = new Set<Category>(['work', 'personal', 'health', 'learning'])
const dayPeriods = new Set<DayPeriod>(['AM', 'PM'])
const repeatTypes = new Set<RepeatType>([
  'none',
  'daily',
  'weekly',
  'weekly-x',
  'monthly',
  'every-n-days',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isText(value: unknown, maxLength: number, required = false): value is string {
  return (
    typeof value === 'string' &&
    value.length <= maxLength &&
    (!required || value.trim().length > 0)
  )
}

function isDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function isHour(value: unknown): value is string {
  return typeof value === 'string' && /^(?:0?[1-9]|1[0-2])$/.test(value)
}

function isMinute(value: unknown): value is string {
  return typeof value === 'string' && /^(?:[0-5]\d)$/.test(value)
}

function isOptionalRepeatOptions(value: Record<string, unknown>): boolean {
  const repeatTypeIsValid = value.repeatType === undefined || repeatTypes.has(value.repeatType as RepeatType)
  const weekDaysAreValid =
    value.repeatWeekDays === undefined ||
    (Array.isArray(value.repeatWeekDays) &&
      value.repeatWeekDays.every((day) => isFiniteNumber(day) && Number.isInteger(day) && day >= 0 && day <= 6))
  const intervalIsValid =
    value.repeatEveryNDays === undefined ||
    (isFiniteNumber(value.repeatEveryNDays) &&
      Number.isInteger(value.repeatEveryNDays) &&
      value.repeatEveryNDays >= 1 &&
      value.repeatEveryNDays <= 365)
  const endDateIsValid =
    value.repeatEndDate === undefined ||
    value.repeatEndDate === null ||
    isDateString(value.repeatEndDate)

  return repeatTypeIsValid && weekDaysAreValid && intervalIsValid && endDateIsValid
}

export function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false

  return (
    isFiniteNumber(value.id) &&
    Number.isInteger(value.id) &&
    value.id >= 0 &&
    isText(value.title, 200, true) &&
    isText(value.notes, 1000) &&
    typeof value.completed === 'boolean' &&
    priorities.has(value.priority as Priority) &&
    isText(value.due, 100, true) &&
    isFiniteNumber(value.estimatedMinutes) &&
    Number.isInteger(value.estimatedMinutes) &&
    value.estimatedMinutes >= 0 &&
    value.estimatedMinutes <= 999 &&
    isFiniteNumber(value.difficulty) &&
    Number.isInteger(value.difficulty) &&
    value.difficulty >= 1 &&
    value.difficulty <= 5 &&
    categories.has(value.category as Category) &&
    isOptionalRepeatOptions(value)
  )
}

export function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!isRecord(value)) return false

  return (
    isFiniteNumber(value.id) &&
    Number.isInteger(value.id) &&
    value.id >= 0 &&
    isText(value.title, 200, true) &&
    isText(value.notes, 500) &&
    isDateString(value.date) &&
    isHour(value.startHour) &&
    isMinute(value.startMinute) &&
    dayPeriods.has(value.startPeriod as DayPeriod) &&
    isHour(value.endHour) &&
    isMinute(value.endMinute) &&
    dayPeriods.has(value.endPeriod as DayPeriod) &&
    isText(value.location, 200) &&
    categories.has(value.category as Category) &&
    isOptionalRepeatOptions(value)
  )
}

function readArray<T>(
  key: string,
  fallback: readonly T[],
  validateItem: (value: unknown) => value is T,
): T[] {
  try {
    if (typeof window === 'undefined') return [...fallback]

    const saved = window.localStorage.getItem(key)
    if (saved === null) return [...fallback]

    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.every(validateItem)) {
      console.warn(`Ignoring invalid localStorage value for "${key}".`)
      return [...fallback]
    }

    return parsed
  } catch (error) {
    console.warn(`Unable to load localStorage value for "${key}".`, error)
    return [...fallback]
  }
}

function writeArray<T>(key: string, items: readonly T[]): boolean {
  try {
    if (typeof window === 'undefined') return false
    window.localStorage.setItem(key, JSON.stringify(items))
    return true
  } catch (error) {
    console.warn(`Unable to save localStorage value for "${key}".`, error)
    return false
  }
}

export function saveTasks(tasks: readonly Task[]): boolean {
  return writeArray(TASKS_STORAGE_KEY, tasks)
}

export function saveEvents(events: readonly CalendarEvent[]): boolean {
  return writeArray(EVENTS_STORAGE_KEY, events)
}

export function saveBackupData(
  tasks: readonly Task[],
  events: readonly CalendarEvent[],
): boolean {
  try {
    if (typeof window === 'undefined') return false

    const previousTasks = window.localStorage.getItem(TASKS_STORAGE_KEY)
    const previousEvents = window.localStorage.getItem(EVENTS_STORAGE_KEY)

    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
      window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
      return true
    } catch (error) {
      if (previousTasks === null) {
        window.localStorage.removeItem(TASKS_STORAGE_KEY)
      } else {
        window.localStorage.setItem(TASKS_STORAGE_KEY, previousTasks)
      }
      if (previousEvents === null) {
        window.localStorage.removeItem(EVENTS_STORAGE_KEY)
      } else {
        window.localStorage.setItem(EVENTS_STORAGE_KEY, previousEvents)
      }
      throw error
    }
  } catch (error) {
    console.warn('Unable to restore backup data to localStorage.', error)
    return false
  }
}

export function loadTasks(fallback: readonly Task[] = []): Task[] {
  return readArray(TASKS_STORAGE_KEY, fallback, isTask)
}

export function loadEvents(fallback: readonly CalendarEvent[] = []): CalendarEvent[] {
  return readArray(EVENTS_STORAGE_KEY, fallback, isCalendarEvent)
}
