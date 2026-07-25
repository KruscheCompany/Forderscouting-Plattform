# Completed Tickets

Tracks Jira tickets finished in this repo (+ related BE repo commits).

## PAV-209 — Project Priority List (Leader)
- Leaders can pin/reorder project ideas into a dedicated, drag-to-reorder priority section above the main Project Dashboard table; pinned projects leave the main table while pinned. Read-only for everyone else in the municipality.
- Admin gets the same section with a municipality picker to inspect any municipality's list, including which leader set it.
- BE: new `prioritized-project` content-type (mirrors `watchlist`'s shape) + role-gated CRUD + reorder endpoint; main dashboard query (`getApplicationProcess`) excludes prioritized projects; cascade-cleanup on project archive/delete.
- Commits: FE `bf5b570`..`9505205`, BE (Forderscouting-Plattform-API) `ead60f3`..`cdace06`.

## PAV-207 — Status Antragstellung + Eligibility Filter
- Red/green eligibility indicator (`applicationEligible`) in home-widget funding table (`src/components/funding/info.vue`) and community/my-data funding table (`src/components/data/overview.vue`).
- Filter menu (All/Eligible/Not Eligible, default All) matching app's existing icon/menu idiom.
- BE fix: `applicationEligible` was missing from `fields` select in `_buildGetFundingFilters()` — added.
- Commits: FE `535664c`, BE (Forderscouting-Plattform-API) `a8f2079`.

## PAV-208 — Bug: Home Funding List Not Scoped
- Non-admin users saw all fundings regardless of municipality/federal state.
- Fix: `funding.js` `find()` now scopes non-admins by `federalStateIds` (query filter) + `municipalityId` (post-filter), mirroring `project.js`'s pattern. Admins unaffected (bypass intact). Existing owner/editors/readers/visibility/published/archived filtering preserved.
- Commit: BE (Forderscouting-Plattform-API) `1dd106a`.
- Note: Jira status still shows "In Progress" as of this check — fix is committed and clean in the BE repo; flag to move ticket to Done.

## PAV-213 — Bug: Archived Projects Visibility + Permission
- Archiving a project idea (`archived` field via `update()`) was gated only by the general owner/editor check — any editor could archive, not just municipality leadership. Now requires leader (scoped to their own municipality) or admin.
- New collapsible "Archived Applications" table at bottom of Project Dashboard (`ArchivedTable.vue`), hidden by default, visible only to leader/admin, lazy-fetches on first expand.
- BE: wired up previously-unreachable `findArchived()` (no route, no auth, no scoping before) — added auth gate + municipality scoping for leaders (admin sees all) + route `GET /project/dashboard/archived`.
- Funding archiving untouched — changes scoped to `project` only.
- Commits: FE `bdb405e`, BE (Forderscouting-Plattform-API) `1ff338e`.
