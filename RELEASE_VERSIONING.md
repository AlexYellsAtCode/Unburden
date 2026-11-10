# Release Versioning & Roadmap

## Semantic Versioning Strategy

PlanAware uses **Semantic Versioning** (semver) in the format: `MAJOR.MINOR.PATCH`

### Version Format Explained

- **MAJOR** (X.0.0): Incompatible API or significant feature changes
- **MINOR** (1.X.0): New features added in backward-compatible manner
- **PATCH** (1.0.X): Bug fixes and minor improvements

### Version Increment Rules

| Type | Increment | Example |
|------|-----------|---------|
| New major feature | MAJOR | v0.5.0 → v1.0.0 |
| New minor feature | MINOR | v1.0.0 → v1.1.0 |
| Bug fix | PATCH | v1.0.0 → v1.0.1 |
| Alpha/Beta release | Add suffix | v1.0.0-alpha.1 |
| Release candidate | Add suffix | v1.0.0-rc.1 |

---

## Release Roadmap

### v1.0.0 (December 22, 2026) - Core Persistence & Settings
**Status**: In Development (Sprints 1-3)

**Key Features**:
- ✅ Hybrid data persistence (LocalStorage + IndexedDB + JSON export)
- ✅ Automatic backup scheduling
- ✅ Settings menu with themes and text size
- ✅ Full offline functionality

**Delivery Plan**:
- Sprint 1 (Nov 10-24): Phase 1 LocalStorage
- Sprint 2 (Nov 24-Dec 8): Phases 2-3 IndexedDB & Export
- Sprint 3 (Dec 8-22): Phase 4 Automatic backups + Settings

**Criteria for Release**:
- [ ] All issues marked for v1.0.0 are closed
- [ ] No critical/high severity bugs remain
- [ ] Code reviewed and merged to main
- [ ] Documentation updated (README, docs/)
- [ ] Manual testing completed
- [ ] Demo mode updated with new features
- [ ] Release notes prepared
- [ ] Tag created: `git tag -a v1.0.0 -m "Release v1.0.0"`

---

### v1.1.0 (TBD) - Performance & Polish
**Status**: Planned (Post-v1.0.0)

**Potential Features**:
- Search performance optimization
- Calendar rendering improvements
- Improved mobile responsiveness
- Additional theme options
- Keyboard shortcuts
- Data export formats (PDF, CSV)

**Estimated Timeline**: Q1 2027 (6-8 weeks after v1.0.0)

---

### v2.0.0 (TBD) - Advanced Persistence
**Status**: Concept (Post-v1.1.0)

**Potential Features**:
- Cloud synchronization
- Multi-device sync
- Collaborative features
- Real backend API
- Authentication system
- Server-side backup management

**Estimated Timeline**: Q2-Q3 2027

---

## How to Create a Release

### Pre-Release Checklist

1. **Update version numbers**
   ```bash
   # In package.json
   "version": "1.0.0"
   ```

2. **Update README.md**
   - Update version references
   - Add new features to feature list
   - Update getting started if needed

3. **Update CHANGELOG** (create if doesn't exist)
   ```markdown
   # Changelog

   All notable changes to this project will be documented in this file.

   ## [1.0.0] - 2026-12-22

   ### Added
   - Hybrid data persistence with LocalStorage, IndexedDB, and JSON export
   - Automatic backup scheduling
   - Settings menu with dark theme and text size options

   ### Changed
   - [List any changes to existing features]

   ### Fixed
   - [List bug fixes]

   ### Removed
   - [List deprecated features]
   ```

4. **Prepare release notes**
   ```bash
   # Example release notes format
   ## What's New in PlanAware v1.0.0

   ### Persistent Data
   Your tasks and events now survive a page refresh! We've implemented automatic saving to keep your data safe.

   ### Customization
   - Choose between light and dark themes
   - Adjust text size to your preference

   ### Backup & Export
   Manually export your data as JSON or let PlanAware back up automatically.

   See CHANGELOG.md for full details.
   ```

5. **Test the release**
   ```bash
   npm run build
   npm run preview
   # Verify all features work in production build
   ```

### Release Steps (via GitHub UI)

1. Go to your repository: https://github.com/AlexYellsAtCode/PlanAware
2. Click **Releases** tab
3. Click **Create a new release**
4. Set **Choose a tag**: `v1.0.0`
5. Set **Release title**: `v1.0.0 - Core Persistence & Settings`
6. Add release notes in description (use prepared template)
7. If pre-release, check **This is a pre-release**
8. Click **Publish release**

### Release Steps (via Git CLI)

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0 - Core Persistence & Settings"

# Push tag to remote
git push origin v1.0.0

# Then create release on GitHub via web UI
```

### Post-Release

1. **Verify deployment**
   - Check GitHub Pages site at https://alexyellsatcode.github.io/PlanAware/
   - Confirm version displayed matches release tag

2. **Update social/docs**
   - Update any documentation linking to the release
   - Announce in relevant channels

3. **Archive sprint board**
   - In GitHub Project, move all completed items to Done
   - Take screenshot/notes for retrospective
   - Create board for next sprint

4. **Start next sprint planning**
   - Review issues marked for v1.1.0
   - Break down larger issues into smaller tasks
   - Prepare for Sprint N+1

---

## Version History Template

Keep this in your repository for transparency:

```markdown
# Version History

| Version | Release Date | Focus | Status |
|---------|--------------|-------|--------|
| v1.0.0 | Dec 22, 2026 | Core Persistence & Settings | In Development |
| v1.1.0 | Q1 2027 (estimated) | Performance & Polish | Planned |
| v2.0.0 | Q2-Q3 2027 (estimated) | Cloud Sync & Collaboration | Concept |
```

---

## Breaking Changes Policy

For PlanAware, we commit to:

1. **Documenting breaks**: Any v2.0.0+ that breaks existing features will be clearly noted
2. **Migration guides**: Provide step-by-step guides for users to migrate data
3. **Deprecation warnings**: Features to be removed will warn users 1-2 releases in advance
4. **Backward compatibility**: Within a major version (v1.x.x), maintain backward compatibility

### Example Deprecation Pattern

**v1.0.0**: Feature introduced
**v1.1.0**: New replacement feature added, old feature marked "Deprecated"
**v2.0.0**: Old feature removed

---

## Continuous Deployment Strategy

Once v1.0.0 is released, consider:

1. **Automated Releases**: Use GitHub Actions to auto-deploy to GitHub Pages
2. **Pre-release Testing**: Deploy v1.x.0-beta versions before final release
3. **Rollback Plan**: Keep previous release buildable in case of critical issues
4. **Release Notes Auto-generation**: Use changelog generators to speed up release notes

---

## Questions & Support

For more on semantic versioning:
- [Semantic Versioning Official](https://semver.org/)
- [GitHub Release Management](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
