# GitHub Project Quick-Start Checklist

This checklist will get your GitHub Project set up in ~20 minutes.

---

## ✅ Part 1: Create the Project (5 minutes)

### Step 1.1: Open GitHub Project Creation
- [ ] Go to: https://github.com/AlexYellsAtCode/PlanAware
- [ ] Click **Projects** tab (between Pull Requests and Security)
- [ ] Click **New project** button
- [ ] Choose **Table** template
- [ ] Enter title: `PlanAware Development`
- [ ] Click **Create project**

### Step 1.2: Initial Project View
You should now see:
- [ ] An empty table with columns for Title, Status, etc.
- [ ] An **Add item** button
- [ ] Settings icon in top right

---

## ✅ Part 2: Add Custom Fields (10 minutes)

### Step 2.1: Add Status Field
1. Click **+ Add field** (appears when you hover over column headers)
2. Select **Single select**
3. Name: `Status`
4. Add options:
   - [ ] 📋 Backlog
   - [ ] 🔄 In Progress
   - [ ] 👀 In Review
   - [ ] ✅ Done
5. Click **Save**

### Step 2.2: Add Priority Field
1. Click **+ Add field**
2. Select **Single select**
3. Name: `Priority`
4. Add options:
   - [ ] 🔴 P0 (Critical)
   - [ ] 🟠 P1 (High)
   - [ ] 🟡 P2 (Medium)
   - [ ] ⚪ P3 (Low)
5. Click **Save**

### Step 2.3: Add Sprint Field
1. Click **+ Add field**
2. Select **Single select**
3. Name: `Sprint`
4. Add options:
   - [ ] Sprint 1 (Nov 10-24) - Persistence Phase 1
   - [ ] Sprint 2 (Nov 24-Dec 8) - Phases 2-3
   - [ ] Sprint 3 (Dec 8-22) - Phase 4 + Settings
   - [ ] Backlog
   - [ ] Future
5. Click **Save**

### Step 2.4: Add Release Field
1. Click **+ Add field**
2. Select **Single select**
3. Name: `Release`
4. Add options:
   - [ ] v1.0.0
   - [ ] v1.1.0
   - [ ] v2.0.0
   - [ ] Future
5. Click **Save**

### Step 2.5: Add Type Field
1. Click **+ Add field**
2. Select **Single select**
3. Name: `Type`
4. Add options:
   - [ ] 🚀 Feature
   - [ ] 🐛 Bug
   - [ ] 📚 Documentation
   - [ ] 🔧 Refactor
   - [ ] 🧪 Testing
5. Click **Save**

### Step 2.6: Add Effort Field
1. Click **+ Add field**
2. Select **Number**
3. Name: `Effort (Hours)`
4. Click **Save**

---

## ✅ Part 3: Link Existing Issues (3 minutes)

### Step 3.1: Add Issues to Project
1. Go back to project
2. Click **Add item** or click a cell in the table
3. Search for issue by number: `#2`
4. Click to add Issue #2 to project
5. Repeat for issues #1, #3, #4, #5, #6

**Your project should now show 6 issues:**

| # | Title | Status | Priority | Sprint | Release |
|---|-------|--------|----------|--------|---------|
| 6 | Phase 4: Automatic Export Scheduling | | | | |
| 5 | Phase 3: IndexedDB Migration | | | | |
| 4 | Phase 2: JSON Export/Import UI | | | | |
| 3 | Phase 1: LocalStorage Auto-Save | | | | |
| 2 | Implement Hybrid Persistence Model | | | | |
| 1 | Implement Settings Menu | | | | |

### Step 3.2: Fill in Issue Details

For each row, click on the cells to fill in:

**Issue #2** (Hybrid Persistence Model):
- Status: 📋 Backlog
- Priority: 🔴 P0
- Sprint: Sprint 1
- Release: v1.0.0
- Type: 🚀 Feature
- Effort: 2.5

**Issue #3** (Phase 1: LocalStorage):
- Status: 📋 Backlog
- Priority: 🔴 P0
- Sprint: Sprint 1
- Release: v1.0.0
- Type: 🚀 Feature
- Effort: 3

**Issue #4** (Phase 2: Export/Import):
- Status: 📋 Backlog
- Priority: 🟠 P1
- Sprint: Sprint 2
- Release: v1.0.0
- Type: 🚀 Feature
- Effort: 3

**Issue #5** (Phase 3: IndexedDB):
- Status: 📋 Backlog
- Priority: 🟠 P1
- Sprint: Sprint 2
- Release: v1.0.0
- Type: 🚀 Feature
- Effort: 2.5

**Issue #6** (Phase 4: Auto-backup):
- Status: 📋 Backlog
- Priority: 🟠 P1
- Sprint: Sprint 3
- Release: v1.0.0
- Type: 🚀 Feature
- Effort: 2

**Issue #1** (Settings Menu):
- Status: 📋 Backlog
- Priority: 🟠 P1
- Sprint: Sprint 3
- Release: v1.0.0
- Type: 🚀 Feature
- Effort: 2

---

## ✅ Part 4: Create Views (2 minutes)

### Step 4.1: Create "Sprint 1 Board"
1. Click **+ Add view** (top right area)
2. Select **Board**
3. Name: `Sprint 1 Progress`
4. Configure layout:
   - **Group by**: Status field
   - **Columns**: Backlog → In Progress → In Review → Done
5. Add filter:
   - **Sprint** = "Sprint 1 (Nov 10-24)"
6. Click **Save**

### Step 4.2: Create "All Work"
1. Click **+ Add view**
2. Select **Table**
3. Name: `All Work`
4. Arrange columns: Title, Status, Priority, Sprint, Release, Effort
5. Click **Save**

### Step 4.3: Create "Backlog"
1. Click **+ Add view**
2. Select **Table**
3. Name: `Backlog`
4. Add filter:
   - **Status** = "Backlog"
5. Sort by: Priority (descending)
6. Click **Save**

---

## ✅ Part 5: Start Using Your Project (2 minutes)

### Daily Workflow
1. Open [PlanAware Project](https://github.com/AlexYellsAtCode/PlanAware/projects)
2. Click **Sprint 1 Progress** view
3. See all Sprint 1 items in Kanban board
4. Move items between columns as you work

### Moving Items Between Columns
- **Backlog → In Progress**: Click item, click Status field, select "🔄 In Progress"
- **In Progress → In Review**: When PR is open, change to "👀 In Review"
- **In Review → Done**: When PR is merged/issue closed, change to "✅ Done"

### Updating GitHub Issues
When you make changes in GitHub (comment, close, etc.):
- [ ] Project view updates automatically
- [ ] Status field reflects issue state
- [ ] No need to manually sync

---

## ✅ Optional: Set Up Automation

**GitHub Project Automation** (if available in your repo plan):

1. Go to project **Settings** (gear icon)
2. Look for **Workflows** or **Automation**
3. Consider enabling:
   - ✓ "Auto-add issues and pull requests"
   - ✓ "Auto-update status when PRs open/merge"

If these options aren't visible, your plan might not support automation. No problem—you can update status manually.

---

## ✅ You're Done! 🎉

Your GitHub Project is now ready to use!

### Next Steps:
1. **Today**: Bookmark the project and open it daily
2. **Tomorrow**: Start work on Sprint 1 (Issues #2 and #3)
3. **Nov 24**: Sprint 1 review & Sprint 2 planning
4. **Every 2 weeks**: Repeat sprint cycle

### Project URL
https://github.com/AlexYellsAtCode/PlanAware/projects/[PROJECT_NUMBER]

(GitHub will show you the exact URL after creation)

---

## Quick Reference: Troubleshooting

### "Can't see my issues in the project"
→ Click **Add item** and search for issue by number (#2, #3, etc.)

### "Status field not updating automatically"
→ Your plan might not have automation. Update manually by clicking the Status cell.

### "Want to add more fields?"
→ Click **+ Add field** anywhere in the table to create custom fields.

### "Want to hide a view?"
→ Hover over the view tab and click the "..." menu, then "Modify" or "Delete"

---

## Learn More

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Agile Sprint Planning](https://www.atlassian.com/agile/scrum/sprint-planning)
- [How to Use Kanban Boards](https://www.atlassian.com/agile/kanban)

---

**Time to completion**: ~20-30 minutes  
**Difficulty**: Easy  
**Questions?** Refer to [GITHUB_PROJECT_SETUP.md](./GITHUB_PROJECT_SETUP.md) for detailed guidance.
