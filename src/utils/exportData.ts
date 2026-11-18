import type { CalendarEvent, Task } from '../types'

export interface BackupData {
  exportDate: string
  appVersion: string
  tasks: Task[]
  events: CalendarEvent[]
}

export const APP_VERSION = '0.0.0'

export function createBackupData(
  tasks: readonly Task[],
  events: readonly CalendarEvent[],
  exportDate = new Date(),
): BackupData {
  return {
    exportDate: exportDate.toISOString(),
    appVersion: APP_VERSION,
    tasks: tasks.map((task) => ({
      ...task,
      ...(task.repeatWeekDays ? { repeatWeekDays: [...task.repeatWeekDays] } : {}),
    })),
    events: events.map((event) => ({
      ...event,
      ...(event.repeatWeekDays ? { repeatWeekDays: [...event.repeatWeekDays] } : {}),
    })),
  }
}

export function createBackupFilename(exportDate = new Date()): string {
  return `planaware-backup-${exportDate.toISOString().slice(0, 10)}.json`
}

export function exportToJSON(
  tasks: readonly Task[],
  events: readonly CalendarEvent[],
  exportDate = new Date(),
): string {
  if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') {
    throw new Error('Backup downloads are not supported in this environment.')
  }

  const backup = createBackupData(tasks, events, exportDate)
  const filename = createBackupFilename(exportDate)
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  try {
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
  } finally {
    link.remove()
    URL.revokeObjectURL(url)
  }

  return filename
}
