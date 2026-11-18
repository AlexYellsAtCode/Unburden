import type { CalendarEvent, Task } from '../types'
import type { BackupData } from './exportData'
import { isCalendarEvent, isTask } from './localStorage'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasUniqueIds(items: readonly { id: number }[]): boolean {
  return new Set(items.map((item) => item.id)).size === items.length
}

export class BackupImportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BackupImportError'
  }
}

export function parseBackupJSON(contents: string): BackupData {
  let parsed: unknown

  try {
    parsed = JSON.parse(contents)
  } catch {
    throw new BackupImportError('This file is not valid JSON. Choose an Unburden backup file and try again.')
  }

  if (!isRecord(parsed)) {
    throw new BackupImportError('The backup must contain a JSON object.')
  }
  if (typeof parsed.exportDate !== 'string' || Number.isNaN(Date.parse(parsed.exportDate))) {
    throw new BackupImportError('The backup is missing a valid export date.')
  }
  if (typeof parsed.appVersion !== 'string' || parsed.appVersion.trim() === '') {
    throw new BackupImportError('The backup is missing the app version.')
  }
  if (!Array.isArray(parsed.tasks)) {
    throw new BackupImportError('The backup is missing a valid tasks list.')
  }
  if (!Array.isArray(parsed.events)) {
    throw new BackupImportError('The backup is missing a valid events list.')
  }

  const invalidTask = parsed.tasks.findIndex((task) => !isTask(task))
  if (invalidTask !== -1) {
    throw new BackupImportError(`Task ${invalidTask + 1} does not match the expected Unburden data format.`)
  }

  const invalidEvent = parsed.events.findIndex((event) => !isCalendarEvent(event))
  if (invalidEvent !== -1) {
    throw new BackupImportError(`Event ${invalidEvent + 1} does not match the expected Unburden data format.`)
  }

  const tasks = parsed.tasks as Task[]
  const events = parsed.events as CalendarEvent[]

  if (!hasUniqueIds(tasks)) {
    throw new BackupImportError('The backup contains duplicate task IDs.')
  }
  if (!hasUniqueIds(events)) {
    throw new BackupImportError('The backup contains duplicate event IDs.')
  }

  return {
    exportDate: parsed.exportDate,
    appVersion: parsed.appVersion,
    tasks,
    events,
  }
}

export async function importFromJSON(file: File): Promise<BackupData> {
  if (!file.name.toLowerCase().endsWith('.json')) {
    throw new BackupImportError('Choose a .json backup file.')
  }

  try {
    return parseBackupJSON(await file.text())
  } catch (error) {
    if (error instanceof BackupImportError) throw error
    throw new BackupImportError('The backup file could not be read. Try selecting it again.')
  }
}
