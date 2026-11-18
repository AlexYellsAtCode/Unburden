# Unburden Persistence Strategy & Offline Options

## Current State: LocalStorage Auto-Save and JSON Backup (Phases 1-2)

### How Persistence Works Today

Unburden stores task and event data in React state and automatically persists both
collections to the browser's `localStorage`.

```typescript
// src/utils/localStorage.ts
saveTasks(tasks)
saveEvents(events)

// src/App.tsx
useEffect(() => {
  setTasks(loadTasks(seedTasks))
  setEvents(loadEvents(seedEvents))
  setLoading(false)
}, [])
```

**Key characteristics:**
- Tasks are stored under `planaware_tasks`
- Events are stored under `planaware_events`
- Each collection is saved after its React state changes
- Reads happen immediately and do not make a network request
- Saved JSON is checked for the expected array and item shape before use
- Missing or invalid values fall back to the configured initial data
- Demo seed data (`VITE_USE_SEED_DATA=true`) is used only when no valid saved value
  exists, so opening demo mode does not overwrite an existing local data set
- A valid saved empty array stays empty; it is not replaced with demo data
- Storage access failures are reported with `console.warn` and do not prevent
  the app from continuing in memory

Auto-save effects are gated until the initial read completes. This prevents the
initial empty React state from overwriting stored data during the first render
(including React Strict Mode development checks).

### JSON Backup and Restore (Phase 2)

The floating **Backup / Restore** button downloads or restores an offline JSON
backup. Downloads use the name
`planaware-backup-YYYY-MM-DD.json` and pretty-print the contents for easy
reading and version control.

The backup format is:

```json
{
  "exportDate": "2026-11-10T10:09:00.000Z",
  "appVersion": "0.0.0",
  "tasks": [],
  "events": []
}
```

- `exportDate` is an ISO 8601 timestamp.
- `appVersion` identifies the app version that created the backup.
- `tasks` and `events` contain the complete `Task` and `CalendarEvent` objects
  documented in [DATA_MODEL.md](../design/DATA_MODEL.md).
- JSON escaping preserves quotes, newlines, and other special characters.
- Empty collections and large collections are supported without a special
  conversion step.

Before a restore, Unburden validates the JSON syntax, metadata, required
collections, task/event fields, and duplicate IDs. The restore preview shows
the task and event counts, export date, and source app version. Restoring uses a
**replace** strategy: after explicit confirmation, both existing collections
are replaced and written back to the Phase 1 `localStorage` keys.

Invalid files do not modify current data. If browser storage cannot be written,
the attempted replacement is rolled back and the app displays an explicit
warning without changing the current tasks or events.

### Storage Keys and Location

Data is scoped to the browser profile and origin (protocol, host, and port).
Normal and demo entry points on the same deployment therefore share the same
keys:

| Key | Value |
|-----|-------|
| `planaware_tasks` | JSON array of `Task` objects |
| `planaware_events` | JSON array of `CalendarEvent` objects |

In browser DevTools, inspect **Application** (or **Storage**) → **Local
Storage** → the app origin.

### Troubleshooting

- If data is unexpectedly absent, confirm the current URL and browser profile
  match the profile where it was saved. A different port is a different origin.
- To start over, remove only `planaware_tasks` and/or `planaware_events` in
  DevTools, then refresh. Clearing all site data also removes these values.
- Invalid JSON or an invalid item shape is ignored and replaced with the initial
  fallback on the next save. Check the browser console for the storage warning.
- Private/incognito sessions have separate, temporary storage. Saved data may be
  removed when the private session closes.
- If the browser blocks storage or the quota is exceeded, the app continues
  in-memory for the current session and logs a warning. Free site storage or use
  a browser profile that permits local storage.

---

## Offline-First Persistence Options

Since you want to keep the system **fully offline** (even when deployed), here are your options, ranked by implementation complexity and persistence capability:

### Option 1: **Browser LocalStorage** ✅ Simplest
**Persistence scope**: Current browser only | **Works offline**: Yes | **Complexity**: Low

#### How it works:
- Store tasks/events as JSON in browser's `localStorage`
- Survives page refreshes
- Works completely offline
- ~5-10MB capacity limit

#### Implementation:
```typescript
// Save to localStorage
localStorage.setItem('planaware_tasks', JSON.stringify(tasks))
localStorage.setItem('planaware_events', JSON.stringify(events))

// Load from localStorage
useEffect(() => {
  setTasks(loadTasks())
  setEvents(loadEvents())
}, [])
```

#### Pros:
- ✅ Extremely simple to implement
- ✅ No dependencies needed
- ✅ Works on any device with a browser
- ✅ Immediate page load (no async loading)
- ✅ Perfect for mobile web apps
- ✅ Survives browser crashes

#### Cons:
- ❌ Data lost if user clears browser cache
- ❌ Not synced between devices
- ❌ No automatic backups
- ❌ Not queryable (must load entire dataset)
- ❌ Shared across all sites (though isolated by domain)

#### Best for:
Personal devices, single-user setup, quick MVP, mobile PWAs

---

### Option 2: **IndexedDB** ✅ Recommended for Scale
**Persistence scope**: Current browser only | **Works offline**: Yes | **Complexity**: Medium

#### How it works:
- Browser's NoSQL database
- Can store large amounts of structured data
- Supports querying and indexing
- Asynchronous API

#### Implementation:
```javascript
const DB_NAME = 'UnburdenDB'
const DB_VERSION = 1

function getDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' })
      }
    }
  })
}

// Save
async function saveTasks(tasks) {
  const db = await getDB()
  const tx = db.transaction('tasks', 'readwrite')
  tx.objectStore('tasks').clear()
  tasks.forEach(task => tx.objectStore('tasks').add(task))
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve
    tx.onerror = reject
  })
}

// Load
async function loadTasks() {
  const db = await getDB()
  const tx = db.transaction('tasks', 'readonly')
  return new Promise((resolve, reject) => {
    const req = tx.objectStore('tasks').getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = reject
  })
}
```

#### Pros:
- ✅ Stores large datasets efficiently (~GB+ capacity)
- ✅ Supports complex queries and indexing
- ✅ No external dependencies
- ✅ Better performance than localStorage for large data
- ✅ Survives browser crashes and cache clears (usually)
- ✅ Good for PWAs

#### Cons:
- ❌ Async API (more complex code)
- ❌ Slightly more complex to understand
- ❌ Can be cleared by user/browser
- ❌ No cross-device sync
- ❌ No version control/history

#### Best for:
Power users, large task lists, complex queries needed, single device

---

### Option 3: **Export/Import JSON Files** ✅ Implemented in Phase 2
**Persistence scope**: User's file system | **Works offline**: Yes | **Complexity**: Low-Medium

#### How it works:
- Let users download their data as JSON files
- Let users import data from JSON files
- Users store files locally or in cloud storage (Dropbox, Google Drive, etc.)

#### Implementation:

The implementation lives in `src/utils/exportData.ts` and
`src/utils/importData.ts`. Exports download a formatted blob. Imports read the
selected file, validate every item with the same guards used for localStorage,
and return parsed tasks/events for the restore preview.

#### Pros:
- ✅ User has full control over data
- ✅ Easy backup strategy (save files to cloud)
- ✅ Cross-device sync (copy file to device, import)
- ✅ Version control friendly (easy to see diffs)
- ✅ Works with any storage system (cloud drives, USB, etc.)
- ✅ Human-readable format
- ✅ No database complexity

#### Cons:
- ❌ Manual process (requires user action)
- ❌ Easy to lose data if not backed up
- ❌ No automatic sync
- ❌ Requires file system access on device

#### Best for:
Users who want control, cloud storage integration, manual workflows, developers

---

### Option 4: **Hybrid Approach** ✅ Best Overall
**Persistence scope**: Browser + file system | **Works offline**: Yes | **Complexity**: Medium-High

#### How it works:
- Use IndexedDB or localStorage as primary storage (automatic)
- Add export/import for backup and cross-device sync
- Auto-save to IndexedDB after every change
- Manual export to file periodically

#### Implementation strategy:
```javascript
// Auto-save on any change
useEffect(() => {
  // Save to IndexedDB whenever tasks change
  saveTasks(tasks)
}, [tasks])

useEffect(() => {
  // Save to IndexedDB whenever events change
  saveEvents(events)
}, [events])

// Load on app start
useEffect(() => {
  Promise.all([loadTasks(), loadEvents()]).then(([tasks, events]) => {
    setTasks(tasks)
    setEvents(events)
    setLoading(false)
  })
}, [])
```

Then add UI buttons:
- "Download Backup" → exports as JSON
- "Import Backup" → imports from JSON
- "Sync" → manual sync button

#### Pros:
- ✅ Automatic persistence with IndexedDB
- ✅ Manual backups via JSON export
- ✅ Cross-device via file sharing
- ✅ User has control over backups
- ✅ Survives browser cache clear
- ✅ Most resilient approach

#### Cons:
- ❌ More code to maintain
- ❌ Users need to remember to export
- ❌ Slightly more complex UX

#### Best for:
Production applications, users who need both convenience and control

---

## Comparison Table

| Feature | LocalStorage | IndexedDB | JSON Export | Hybrid |
|---------|-------------|-----------|-------------|--------|
| **Persistence** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Auto-save** | ✅ Easy | ✅ Yes | ❌ Manual | ✅ Yes |
| **Capacity** | ~5-10MB | ~1GB+ | Unlimited* | ~1GB+ |
| **Offline** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cross-device** | ❌ No | ❌ No | ✅ Via file | ✅ Yes |
| **Querying** | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **Complexity** | Low | Medium | Low | Medium |
| **User Control** | Low | Low | ✅ High | ✅ High |
| **Best For** | MVP/PWA | Power users | Control | Production |

*Unlimited if stored in cloud storage

---

## Implementation Recommendation

### For Immediate Deployment: **Option 1 (LocalStorage)**
- Zero dependencies
- 30 minutes to implement
- Works perfectly for first release
- Easy to upgrade later

### For Production: **Option 4 (Hybrid)**
- Add IndexedDB for automatic persistence
- Add export/import for user control
- Give users confidence their data is safe
- Allow cross-device workflows

### Implementation Priority:
1. **Phase 1**: Add LocalStorage auto-save (30 min)
2. **Phase 2**: Add validated JSON export/import controls (complete)
3. **Phase 3**: Replace localStorage with IndexedDB (2-3 hours)
4. **Phase 4**: Add automatic export scheduling (1-2 hours)

---

## Code Implementation Template

### Phase 1: Add LocalStorage
```typescript
// Add after state declarations
useEffect(() => {
  setTasks(loadTasks(seedTasks))
  setEvents(loadEvents(seedEvents))
  setLoading(false)
}, [])

// Auto-save tasks
useEffect(() => {
  if (!loading) saveTasks(tasks)
}, [tasks, loading])

// Auto-save events
useEffect(() => {
  if (!loading) saveEvents(events)
}, [events, loading])
```

### Phase 2: Add Export/Import
Use the floating backup control to download a backup or choose one to import.
The preview dialog is the final confirmation boundary before replacing current
data.

### Phase 3: Migrate to IndexedDB
Create `src/utils/storage.js` with IndexedDB functions, replace localStorage calls.

---

## Key Decisions for Your Setup

### Question 1: Do users need cross-device sync?
- **No** → Use LocalStorage (simplest)
- **Yes** → Use Hybrid (export/import or IndexedDB)

### Question 2: Will task count exceed 5MB?
- **No** → Use LocalStorage
- **Yes** → Use IndexedDB

### Question 3: Should backups be automatic?
- **No** → Use JSON export/import only
- **Yes** → Use IndexedDB or Hybrid

### Question 4: Device type?
- **Web browser only** → Any option works
- **Mobile web (PWA)** → IndexedDB or LocalStorage
- **Desktop deployed app** → Consider Electron + SQLite

---

## No Backend/Server Needed

✅ All options work completely offline without:
- No network calls
- No server backend
- No database server
- No API endpoints
- No synchronization services

Everything stays on the user's device. Perfect for your offline-first requirement!

---

## See Also
- [DATA_MODEL.md](./DATA_MODEL.md) - Task/Event structure
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Current app design
- [ENV_CONFIGURATION.md](../guides/ENV_CONFIGURATION.md) - Environment setup


