import { describe, expect, it, vi } from 'vitest'
import type { CalendarEvent, Task } from '../types'
import {
  createBackupData,
  createBackupFilename,
  exportToJSON,
} from './exportData'
import { BackupImportError, importFromJSON, parseBackupJSON } from './importData'
import { EVENTS_STORAGE_KEY, TASKS_STORAGE_KEY, saveBackupData } from './localStorage'

const task: Task = {
  id: 1,
  title: 'Review "Plan" & notes',
  notes: 'Unicode: caf\u00e9 + \u2615 + newline\nSecond line',
  completed: false,
  priority: 'High',
  due: 'Nov 10, 2026 10:00 AM',
  estimatedMinutes: 45,
  difficulty: 4,
  category: 'work',
  repeatType: 'weekly-x',
  repeatWeekDays: [1, 3, 5],
  repeatEveryNDays: 2,
  repeatEndDate: '2026-12-31',
}

const event: CalendarEvent = {
  id: 2,
  title: 'Planning <session>',
  notes: 'Quotes: "keep these"',
  date: '2026-11-10',
  startHour: '10',
  startMinute: '00',
  startPeriod: 'AM',
  endHour: '10',
  endMinute: '30',
  endPeriod: 'AM',
  location: 'Room A / Zoom',
  category: 'personal',
}

describe('backup export and import', () => {
  it('preserves tasks and events through a file round trip', async () => {
    const backup = createBackupData([task], [event], new Date('2026-11-10T10:09:00Z'))
    const file = new File([JSON.stringify(backup, null, 2)], 'planaware-backup.json', {
      type: 'application/json',
    })
    const restored = await importFromJSON(file)

    expect(restored).toEqual(backup)
    expect(restored.tasks[0].notes).toContain('\n')
  })

  it('supports empty and large collections', () => {
    expect(parseBackupJSON(JSON.stringify(createBackupData([], []))).tasks).toEqual([])

    const tasks = Array.from({ length: 5000 }, (_, index) => ({ ...task, id: index + 1 }))
    const restored = parseBackupJSON(JSON.stringify(createBackupData(tasks, [])))
    expect(restored.tasks).toHaveLength(5000)
  })

  it('creates a timestamped filename', () => {
    expect(createBackupFilename(new Date('2026-11-10T23:59:00Z'))).toBe(
      'planaware-backup-2026-11-10.json',
    )
  })

  it('rejects malformed JSON and invalid schemas', () => {
    expect(() => parseBackupJSON('{nope')).toThrow('not valid JSON')
    expect(() =>
      parseBackupJSON(JSON.stringify({ ...createBackupData([], []), tasks: {} })),
    ).toThrow('valid tasks list')
    expect(() =>
      parseBackupJSON(
        JSON.stringify({
          ...createBackupData([], []),
          tasks: [{ ...task, priority: 'Urgent' }],
        }),
      ),
    ).toThrow('Task 1')
  })

  it('rejects duplicate IDs and non-JSON files', async () => {
    expect(() =>
      parseBackupJSON(JSON.stringify(createBackupData([{ ...task }, { ...task }], []))),
    ).toThrow('duplicate task IDs')

    await expect(importFromJSON({ name: 'backup.txt' } as File)).rejects.toBeInstanceOf(
      BackupImportError,
    )
  })

  it('rolls storage back if a replacement cannot be saved', () => {
    const values = new Map([
      [TASKS_STORAGE_KEY, JSON.stringify([task])],
      [EVENTS_STORAGE_KEY, JSON.stringify([event])],
    ])
    let failNextWrite = true
    const localStorage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        if (key === EVENTS_STORAGE_KEY && failNextWrite) {
          failNextWrite = false
          throw new Error('quota exceeded')
        }
        values.set(key, value)
      }),
      removeItem: vi.fn((key: string) => values.delete(key)),
    }
    vi.stubGlobal('window', { localStorage })

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    expect(saveBackupData([], [])).toBe(false)
    expect(JSON.parse(values.get(TASKS_STORAGE_KEY)!)).toEqual([task])
    expect(JSON.parse(values.get(EVENTS_STORAGE_KEY)!)).toEqual([event])
    expect(warn).toHaveBeenCalledOnce()

    warn.mockRestore()
    vi.unstubAllGlobals()
  })

  it('downloads valid formatted JSON through a browser link', async () => {
    const click = vi.fn()
    const link = { href: '', download: '', style: { display: '' }, click, remove: vi.fn() }
    const appendChild = vi.fn()
    let downloadedBlob: Blob | undefined
    const createObjectURL = vi.fn((blob: Blob) => {
      downloadedBlob = blob
      return 'blob:backup'
    })
    const revokeObjectURL = vi.fn()

    vi.stubGlobal('document', {
      createElement: vi.fn(() => link),
      body: { appendChild },
    })
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })

    const filename = exportToJSON([task], [event], new Date('2026-11-10T10:09:00Z'))

    expect(filename).toBe('planaware-backup-2026-11-10.json')
    expect(link.download).toBe(filename)
    expect(click).toHaveBeenCalledOnce()
    expect(downloadedBlob?.type).toBe('application/json')
    const downloaded = await downloadedBlob!.text()
    expect(downloaded).toContain('\n  "exportDate"')
    expect(parseBackupJSON(downloaded)).toEqual(
      createBackupData([task], [event], new Date('2026-11-10T10:09:00Z')),
    )
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:backup')
    vi.unstubAllGlobals()
  })
})
