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

function isOptionalRepeatOptions(value: Record<string, unknown>): boolean {
  const repeatTypeIsValid = value.repeatType === undefined || repeatTypes.has(value.repeatType as RepeatType)
  const weekDaysAreValid =
    value.repeatWeekDays === undefined ||
    (Array.isArray(value.repeatWeekDays) &&
      value.repeatWeekDays.every((day) => isFiniteNumber(day) && Number.isInteger(day) && day >= 0 && day <= 6))
  const intervalIsValid =
    value.repeatEveryNDays === undefined ||
    (isFiniteNumber(value.repeatEveryNDays) && value.repeatEveryNDays >= 1)
  const endDateIsValid =
    value.repeatEndDate === undefined ||
    value.repeatEndDate === null ||
    typeof value.repeatEndDate === 'string'

  return repeatTypeIsValid && weekDaysAreValid && intervalIsValid && endDateIsValid
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false

  return (
    isFiniteNumber(value.id) &&
    typeof value.title === 'string' &&
    typeof value.notes === 'string' &&
    typeof value.completed === 'boolean' &&
    priorities.has(value.priority as Priority) &&
    typeof value.due === 'string' &&
    isFiniteNumber(value.estimatedMinutes) &&
    isFiniteNumber(value.difficulty) &&
    categories.has(value.category as Category) &&
    isOptionalRepeatOptions(value)
  )
}

function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!isRecord(value)) return false

  return (
    isFiniteNumber(value.id) &&
    typeof value.title === 'string' &&
    typeof value.notes === 'string' &&
    typeof value.date === 'string' &&
    typeof value.startHour === 'string' &&
    typeof value.startMinute === 'string' &&
    dayPeriods.has(value.startPeriod as DayPeriod) &&
    typeof value.endHour === 'string' &&
    typeof value.endMinute === 'string' &&
    dayPeriods.has(value.endPeriod as DayPeriod) &&
    typeof value.location === 'string' &&
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

export function loadTasks(fallback: readonly Task[] = []): Task[] {
  return readArray(TASKS_STORAGE_KEY, fallback, isTask)
}

export function loadEvents(fallback: readonly CalendarEvent[] = []): CalendarEvent[] {
  return readArray(EVENTS_STORAGE_KEY, fallback, isCalendarEvent)
}
