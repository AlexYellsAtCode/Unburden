# Unburden Persistence Strategy & Offline Options

## Current State: In-Memory Only

### How Persistence Works Today

Unburden currently has **NO persistent storage**. All data is stored in-memory using React state:

```javascript
// App.tsx
const [tasks, setTasks] = useState([])
const [events, setEvents] = useState([])

// Initial load (on mount with empty dependency array)
useEffect(() => {
  Promise.all([fakeBackend.listTasks(), fakeBackend.listEvents()]).then(([taskItems, eventItems]) => {
    setTasks(taskItems)
    setEvents(eventItems)
  })
}, [])
```

**Key characteristics:**
- Data is stored in React component state
- Data is fetched from `fakeBackend` (in-memory simulation) on app load
- Optional seed data can be loaded via `VITE_USE_SEED_DATA=true`
- **All data is lost on page refresh**
- No network calls or backend server required

### Limitations
- ❌ Data doesn't persist across browser sessions
- ❌ No offline support (though technically it's already offline)
- ❌ Can't deploy a version where users retain their data
- ❌ Users must re-enter data every session

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
```javascript
// Save to localStorage
localStorage.setItem('tasks', JSON.stringify(tasks))
localStorage.setItem('events', JSON.stringify(events))

// Load from localStorage
useEffect(() => {
  const savedTasks = localStorage.getItem('tasks')
  const savedEvents = localStorage.getItem('events')
  setTasks(savedTasks ? JSON.parse(savedTasks) : [])
  setEvents(savedEvents ? JSON.parse(savedEvents) : [])
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

### Option 3: **Export/Import JSON Files** ✅ Most User-Friendly
**Persistence scope**: User's file system | **Works offline**: Yes | **Complexity**: Low-Medium

#### How it works:
- Let users download their data as JSON files
- Let users import data from JSON files
- Users store files locally or in cloud storage (Dropbox, Google Drive, etc.)

#### Implementation:
```javascript
// Export
function downloadData(tasks, events) {
  const data = { tasks, events, exportDate: new Date().toISOString() }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `planaware-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  
  URL.revokeObjectURL(url)
}

// Import
function handleFileUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (err) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

// Usage
<input 
  type="file" 
  accept=".json" 
  onChange={(e) => {
    const file = e.target.files[0]
    handleFileUpload(file).then(data => {
      setTasks(data.tasks)
      setEvents(data.events)
    })
  }} 
/>
```

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
2. **Phase 2**: Add JSON export/import buttons (1 hour)
3. **Phase 3**: Replace localStorage with IndexedDB (2-3 hours)
4. **Phase 4**: Add automatic export scheduling (1-2 hours)

---

## Code Implementation Template

### Phase 1: Add LocalStorage
```javascript
// Add after state declarations
useEffect(() => {
  // Load from localStorage on mount
  const savedTasks = JSON.parse(localStorage.getItem('planaware_tasks') || '[]')
  const savedEvents = JSON.parse(localStorage.getItem('planaware_events') || '[]')
  setTasks(savedTasks)
  setEvents(savedEvents)
  setLoading(false)
}, [])

// Auto-save tasks
useEffect(() => {
  localStorage.setItem('planaware_tasks', JSON.stringify(tasks))
}, [tasks])

// Auto-save events
useEffect(() => {
  localStorage.setItem('planaware_events', JSON.stringify(events))
}, [events])
```

### Phase 2: Add Export/Import
Add UI buttons and handlers for download/upload of JSON files.

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


