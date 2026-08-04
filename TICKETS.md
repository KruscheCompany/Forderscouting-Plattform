# Completed Tickets

Tracks Jira tickets finished in this repo (+ related BE repo commits).

## PAV-205 — Vorprüfungen & External Review System
- Aptitude step gains three checkbox+button items (Finanzen, Personal, Fördermittelgeber), each with an expandable internal-notes field; ticking + sending emails an anonymized, no-login, one-time review link to the resolved recipient.
- New municipality contact-email fields (`financeContactEmail`/`personnelContactEmail`) power Finanzen/Personal recipient resolution; Fördermittelgeber resolves via the first linked funding guideline's `fundingGuideline[0].info.email` (the relation is manyToMany; first-linked is used as the recipient).
- BE: new `vorpruefung-ticket` content-type; CSPRNG token, 2-month expiry, public by-token GET/POST routes (rate-limited, Public-role-scoped to exactly those two actions); 4-week reminder folded into the existing daily cron job.
- FE: new `VorpruefungTicketCard.vue` (3× per project), read-only twin in the project view, hard gate on the application-process submit button until all three are Positiv, new public `/review/:token` page.
- Commits: FE `a3b87b0..7b07140`, BE (Forderscouting-Plattform-API) `55bfdd8..2ddef5d`.

## PAV-210 — Landkreis (Rural District)
- New organisational level "Landkreis" sits between federal state and municipality, m2m to both (mirrors the existing `municipality.federalStates`/`federal-state.municipalities` pattern); new `landkreis` content-type with a delete guard mirroring `municipality`'s (blocks deletion while any `user_details` are attached).
- `user-detail.landkreis` (optional m2o) added alongside the already-optional `municipality`; users are now assignable to either one, not both — enforced at the FE form layer (mutually-exclusive toggle), not the BE schema.
- Leader-scoped guest-verification (`request.js`) branches on municipality vs landkreis when resolving which leader approves a request.
- Funding scoping (`funding.js`) and project scoping (`project.js`, 4 near-duplicated call sites consolidated into `_resolveProjectMunicipalityScope`) extended so Landkreis-level users see fundings/projects tied to their Landkreis's linked municipalities/federal states (union rule, per decided scope).
- `strapi-server.js` (users-permissions plugin override) and `user-detail.js` controller had several more hard-unguarded `user_detail.municipality.id` accesses beyond the 8 FE call sites originally scoped (leader-uniqueness check, user list sort, data-transfer guard, guest-request/notification scoping) — all branched to support landkreis, since the ticket AC required "no code path hard-requires user.municipality."
- New landkreis Vuex module, admin page (`Landkreise.vue` + dialogs, mirrors `FederalStates.vue`), route, and a `LandkreisSelect.vue` component (mirrors `MunicipalitySelect.vue`'s cleaner rules-as-prop pattern) used in `InviteUser.vue`/`Detail.vue`'s new municipality-vs-landkreis toggle.
- Fixed a pre-existing inverted-ternary validation bug in `Municipality.vue:12` (required-field rule was backwards) while touching that file.
- Design gap found mid-implementation (not in original ticket): `project.municipality` is a required single relation, so a Landkreis-only user creating a project has no municipality of their own to assign — added a required municipality picker (scoped to the user's Landkreis's linked municipalities) to both project-creation flows (`ProjectGeneralInfo.vue`/`ProjectDescriptionCreate.vue` and the legacy `NewProjectIdea.vue`); also fixed an unguarded crash in BE `duplicateProject`.
- Funding-match filtering (`ProjectFundingCheckCreate.vue`) extended via a unified `userFederalStates` computed (municipality's or landkreis's federal states) — no change needed to the AI match payload, which never carried location ids.
- Commits: not yet committed (pending user review).

## PAV-206 — Antragsweg Restructure
- **Deploy order: BE before FE.** The BE (schema sync for `project.details.goalsAndRequirements`/`guidelineCheck` + the data-backfill migration) must be deployed/restarted before the FE, since the FE writes to those `details` fields and Strapi silently drops unknown component fields on write to an un-upgraded BE.
- Merged "Ziele definieren" + "Anforderungen definieren" (`details.projectDevelopmentGoals`/`requirements`) into one step/field `goalsAndRequirements`; new `ProjectGoalsAndRequirements` create+view components replace `ProjectGoals`/`ProjectRequirements`.
- Merged the two Richtlinien-Check Langfassung fields (`details.guidelineContentCheck`/`guidelineFormCheck`) into one `guidelineCheck` field on the surviving `guidelineContentCheck` step; `ProjectGuidelineFormCheck` deleted.
- Moved `financingCheck` step from `projectApplicationSteps` to the end of `projectDevelopmentSteps`; `ProjectFinancingCheck.vue` now owns the projectDevelopment→application tab transition (previously owned by `ProjectRequirements.vue`).
- BE: added `goalsAndRequirements`/`guidelineCheck` text fields to `project.details` component + one-time data-backfill migration (`\n\n---\n\n` concatenation of the old fields); old fields kept until QA verifies the migrated data (see follow-up ticket for the drop).
- Commits: FE `8257aad`..`ded03ea`, BE (Forderscouting-Plattform-API) `c33fb05`..`52b8a4b`.

## PAV-211 — AI Funding Match "Show More" + Drag&Drop
- Removed the frontend-only `.slice(0, 12)` cap in `filterFundingsByUserData()` (`src/components/projects/create/ProjectFundingCheckCreate.vue`); backend AI proxy already returned uncapped results.
- New "Weitere Förderrichtlinien anzeigen" button reveals 4 more tiles per click (`visibleCount`/`canShowMore`/`showMoreMatches`), hides once exhausted.
- Tiles wrapped in `vuedraggable` (single reorderable list, first 12 shown by default via `topSetSize`); whole card stays clickable to select, only the external-link button is drag-excluded.
- `selectedCards` (existing index-based mechanism, reused as-is) is remapped on drag via `onDragChange` so a selected tile stays selected after being moved.
- FE only, no BE changes.

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
