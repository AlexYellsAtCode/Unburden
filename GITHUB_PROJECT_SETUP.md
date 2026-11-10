# GitHub Project Setup Guide for PlanAware

This guide walks you through setting up a GitHub Project for PlanAware with sprint goals and release versioning based on your preferences.

## Quick Summary of Your Choices
- **Current Focus**: Hybrid Persistence Model (with Settings Menu as follow-up)
- **Sprint Duration**: 2 weeks
- **Release Strategy**: Semantic Versioning (v1.0.0, v1.1.0, v2.0.0)
- **Project Views**: Table & Board
- **Target Release**: v1.0.0 (Hybrid Persistence complete)

---

## Step 1: Create the GitHub Project

### Via GitHub Web UI (Recommended)

1. Go to your repository: https://github.com/AlexYellsAtCode/PlanAware
2. Click on the **Projects** tab (next to Code, Pull Requests, Issues)
3. Click **New project**
4. Choose **Table** template
5. Name it: `PlanAware Development`
6. Click **Create project**

### Via GitHub CLI (if auth scopes permit)
```bash
gh project create --owner AlexYellsAtCode --title "PlanAware Development"
```

---

## Step 2: Configure Project Fields

Add these custom fields to your project to track work effectively:

### Field 1: Status
- **Type**: Single Select
- **Options**: 
  - 📋 Backlog
  - 🔄 In Progress
  - 👀 In Review
  - ✅ Done

### Field 2: Priority
- **Type**: Single Select
- **Options**:
  - 🔴 P0 (Critical)
  - 🟠 P1 (High)
  - 🟡 P2 (Medium)
  - ⚪ P3 (Low)

### Field 3: Sprint
- **Type**: Single Select
- **Options**:
  - Sprint 1 (Nov 10-24, 2026) - **Hybrid Persistence Phase 1**
  - Sprint 2 (Nov 24-Dec 8, 2026) - **Hybrid Persistence Phases 2-3**
  - Sprint 3 (Dec 8-22, 2026) - **Hybrid Persistence Phase 4**
  - Backlog
  - Future

### Field 4: Release
- **Type**: Single Select
- **Options**:
  - v1.0.0 (Hybrid Persistence + Settings)
  - v1.1.0 (Performance & Polish)
  - v2.0.0 (Advanced Features)
  - Future

### Field 5: Effort (Story Points)
- **Type**: Number
- **Display**: Used for capacity planning

### Field 6: Type
- **Type**: Single Select
- **Options**:
  - 🚀 Feature
  - 🐛 Bug
  - 📚 Documentation
  - 🔧 Refactor
  - 🧪 Testing

---

## Step 3: Add Custom Views

### View 1: Board View (Kanban)
1. Click **Add View** → **Board**
2. Name: `Sprint Progress`
3. Configure by Status field:
   - Columns: Backlog → In Progress → In Review → Done
4. Filter by: Sprint = Current Sprint

### View 2: Table View - Sprint 1
1. Click **Add View** → **Table**
2. Name: `Sprint 1 - Persistence (Nov 10-24)`
3. Filter: Sprint = "Sprint 1 (Nov 10-24, 2026)"
4. Sort by: Priority (High to Low), then Effort (High to Low)

### View 3: Roadmap View (if available)
1. Click **Add View** → **Roadmap**
2. Name: `Release Roadmap`
3. Configure by Release field
4. Group by: Release

---

## Step 4: Map Issues to Sprint 1

### Sprint 1 Focus: Hybrid Persistence Phase 1 (LocalStorage Auto-Save)
**Dates**: Nov 10-24, 2026 (2 weeks)

#### Issues to add to Sprint 1:

| Issue # | Title | Priority | Sprint | Release | Type |
|---------|-------|----------|--------|---------|------|
| 2 | Implement Hybrid Persistence Model (Multi-Phase) | P0 | Sprint 1 | v1.0.0 | Feature |
| 3 | Phase 1: LocalStorage Auto-Save | P0 | Sprint 1 | v1.0.0 | Feature |

**Sprint 1 Capacity**: ~4-5 hours estimated

### Sprint 2 Focus: Hybrid Persistence Phases 2-3 (IndexedDB + Export/Import)
**Dates**: Nov 24-Dec 8, 2026 (2 weeks)

#### Issues to add to Sprint 2:

| Issue # | Title | Priority | Sprint | Release | Type |
|---------|-------|----------|--------|---------|------|
| 4 | Phase 2: JSON Export/Import UI | P1 | Sprint 2 | v1.0.0 | Feature |
| 5 | Phase 3: IndexedDB Migration | P1 | Sprint 2 | v1.0.0 | Feature |

**Sprint 2 Capacity**: ~5-6 hours estimated

### Sprint 3 Focus: Hybrid Persistence Phase 4 + Settings
**Dates**: Dec 8-22, 2026 (2 weeks)

#### Issues to add to Sprint 3:

| Issue # | Title | Priority | Sprint | Release | Type |
|---------|-------|----------|--------|---------|------|
| 6 | Phase 4: Automatic Export Scheduling | P1 | Sprint 3 | v1.0.0 | Feature |
| 1 | Implement Settings Menu with Themes and Text Size Options | P1 | Sprint 3 | v1.0.0 | Feature |

**Sprint 3 Capacity**: ~4-5 hours estimated

---

## Step 5: How to Use Your Project

### Daily Workflow
1. Open the **Sprint Progress** board view
2. Look for items in **In Progress** column
3. Move to **In Review** when ready for testing
4. Move to **Done** when complete

### Sprint Planning (Every 2 weeks)
1. Go to the **Roadmap** view to see upcoming releases
2. Review the previous Sprint board for any carryover items
3. Select issues from Backlog for the new sprint
4. Set Sprint field to next sprint number
5. Assign priorities and effort estimates

### Release Planning
1. Filter project by Release field
2. Verify all v1.0.0 issues are completed
3. When ready, create a GitHub Release with tag (v1.0.0)
4. Update README.md with new version info
5. Document changes in release notes

### Backlog Grooming
1. Go to Backlog filter view
2. Create new issues for ideas/bugs
3. Prioritize and estimate
4. Move to future sprints as capacity allows

---

## Step 6: Set Up Automation (Optional)

### Auto-link Issues to Project
Go to project settings and enable:
- "Automatically add issues and PRs to this project" ✓

### Auto-update Status on PR/Issue Actions
- When PR opens: Status → In Review
- When PR merges: Status → Done
- When issue closes: Status → Done

---

## Sprint 1 Goals (Nov 10-24, 2026)

### Primary Goal: Foundation for Data Persistence
Establish a robust data persistence strategy that combines localStorage for quick saves with modern storage options.

### What will be done:
✅ Multi-phase hybrid persistence model designed
✅ Phase 1: LocalStorage auto-save implemented
✅ Data survives page refresh/restart
✅ Foundation for IndexedDB integration

### Definition of Done:
- [ ] Issue #2 (Hybrid Persistence Model) - CLOSED
- [ ] Issue #3 (Phase 1: LocalStorage) - CLOSED
- [ ] Code merged to main
- [ ] Demo updated to show data persistence
- [ ] Documentation updated in docs/

### Success Metrics:
- No data loss on page refresh
- Auto-save completes within 500ms
- Project can progress to Phase 2

---

## Release v1.0.0 Roadmap

**Target Date**: December 22, 2026

### Milestones:
1. **Phase 1 (Sprint 1)**: LocalStorage foundation ✓
2. **Phase 2 (Sprint 2)**: JSON export/import UI ✓
3. **Phase 3 (Sprint 2)**: IndexedDB migration ✓
4. **Phase 4 (Sprint 3)**: Automatic backup scheduling ✓
5. **Settings (Sprint 3)**: Themes & text size options ✓

### v1.0.0 Release Notes Template:
```markdown
# PlanAware v1.0.0 - Data Persistence & Settings

**Release Date**: December 22, 2026

## Major Features

### 🎯 Hybrid Data Persistence
- Automatic LocalStorage auto-save
- Advanced IndexedDB support for larger datasets
- Manual JSON export/import for backups
- Automatic backup scheduling

### ⚙️ Settings & Customization
- Dark theme support
- Text size adjustment (small, medium, large)
- Persisted user preferences

### 📋 Improvements
- [List any bug fixes or performance improvements]
- [List any documentation updates]

## Technical Changes
- [List breaking changes if any]
- [List dependency updates]

## Known Issues
- [Any known limitations]

## Upgrade Guide
- No breaking changes; all existing data is preserved

**Full changelog**: [Link to compare commits]
```

---

## Useful GitHub Project Tips

### Tips for Success

1. **Keep issues focused**: Each issue should be completable in <4 hours
2. **Update status regularly**: Stakeholders rely on board visibility
3. **Link related issues**: Use "relates to" or "depends on" in issue bodies
4. **Estimate conservatively**: Add buffer for unknowns
5. **Review completed work**: Close Sprint view after sprint ends and archive completed issues

### GitHub Project Features to Explore

- **Filters**: Create custom filters to find issues by multiple criteria
- **Sorting**: Sort by priority, effort, or date
- **Grouping**: Group by Sprint, Priority, or Release
- **Templates**: Create issue templates for bugs, features, documentation
- **Automation**: Set workflows that auto-update status based on PR/issue events

---

## Next Steps

1. ✅ Create the project using this guide
2. ✅ Add the custom fields to match your workflow
3. ✅ Create the views (Board, Table, Roadmap)
4. ✅ Link existing issues to Sprint 1
5. ✅ Start Sprint 1 planning
6. ⏭️ Run Sprint 1 for 2 weeks
7. ⏭️ Review and retrospect
8. ⏭️ Plan Sprint 2

---

## Questions?

Refer to:
- [GitHub Project Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Sprint Planning Best Practices](https://www.atlassian.com/agile/scrum/sprint-planning)
- Your project's issue descriptions for more details

Good luck with PlanAware! 🚀
