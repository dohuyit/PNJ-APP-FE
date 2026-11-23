# Admin Permissions — Design Spec

**Date:** 2026-10-27
**Scope:** `src/subs/admin/*` + `src/utils/permission.js` + sidebar + auth bootstrap
**Pattern reference:** `zeno-crm-fe` (sibling repo)

---

## 1. Problem

**Correction (2026-10-27):** Initial survey missed `src/subs/admin/auth/permission.js`. The admin layer already has a correctly-wired permission module separate from the legacy CRM `src/utils/permission.js`. The actual gaps are smaller than first reported.

**Current state after re-audit:**

- `src/subs/admin/auth/permission.js` — correct admin permission module. 48 codes aligned with the 14 modules (overview, leads, email, content, collections, calendar, sitecontent, catalog, campaigns, platform_updates, seo_meta/schema/tech/scripts, security). `menuPermissions` map aligned with sidebar. Reads from `zn_admin_permissions` + `zn_admin_enable_permission` via `getStoredPermissions()` + `enablePermission()`. **No changes needed to the registry itself.**
- `src/subs/admin/shared/sidebar.jsx:193` — already filters `ADMIN_NAV_GROUPS` items with `hasPermission(it.permissions)`. **Working.**
- `src/subs/admin/shared/tokens.js` — `ADMIN_NAV_GROUPS` already declares `permissions: menuPermissions.<key>` per item. Needs a spot-check that no item is missing coverage.
- `src/subs/admin/auth/auth-provider.jsx:58` — already calls `persistUserInfo({ user, role, permissions, preferences, enablePermission })` after `/auth/me`. **Working.** The survey's "lines 30-33 commented out" report was wrong.
- `src/subs/admin/auth/session.js:59-72` — `persistUserInfo` already writes `USER_PERMISSIONS_KEY` and `USER_ENABLE_PERMISSION_KEY`. **Working.**
- `src/utils/permission.js` — CRM-legacy orphan, 160+ codes irrelevant to this project. Imported only by `src/components/nav-section/vertical/nav-list.jsx` (which admin's sidebar does not use). **Should be deleted** along with its sole import, or kept only if nav-section is referenced elsewhere.

**Actual gaps to close:**

- **Mock data in `team-view.jsx`** — `ROLES`, `USERS`, `AUDIT_LOGS` arrays (lines ~114-280) still render instead of real API responses. Real hooks (`useGetAuditLogList`, `useGetUserList`, `useGetRoleList`, `useGetPermissionMatrix`) exist at `src/actions/security/*`.
- **Zero module-level `can` object.** Every create/edit/delete button in every admin module is unconditional. The infra is ready; nothing consumes it.
- **Possibly missing per-module action codes.** Current admin `permission` registry has coarse `edit/delete/publish` per module. May need finer codes (e.g. `leads.assign`, `email.send`, `catalog.export`) — audit during Task 1.
- **Orphan `src/utils/permission.js` + `src/components/nav-section/vertical/nav-list.jsx` import** — dead-code cleanup.

Net effect: infra is already there; the enforcement UI layer isn't.

## 2. Goals / Non-goals

**Goals**

- Replace the CRM-copied permission codes with codes matching the 14 real admin modules.
- Attach permission guards to **every** action (create, update, delete, publish, export, bulk) across those 14 modules so that users without the right codes don't see the controls.
- Make the sidebar filter actually honor `menuPermissions`.
- Wire `team-view.jsx` to the real security APIs, delete the mock arrays.
- Make login persist permission codes to the admin localStorage key, and make `hasPermission()` read from that same key.
- Keep a dev convenience bypass: when `zn_admin_enable_permission !== 'true'`, `hasPermission()` returns `true` (everything visible).

**Non-goals**

- Build or redesign the role/permission editor UI (grid, drawers, forms) — Only clean the mock arrays and wire the lists. Editor UX is out of scope.
- Backend changes. We only touch the frontend.
- Migration tooling for existing stored tokens — users log out & back in once.
- i18n of permission labels.

## 3. Decisions (confirmed with user)

| # | Decision |
|---|---|
| D1 | **Scope:** one full-stack phase (not split). |
| D2 | **Deny UX:** hide the control entirely. No "disabled + tooltip". |
| D3 | **Guard pattern:** per-module `can` object (`src/subs/admin/<module>/permissions.js`), consumed as `{can.create && <Button/>}`. |
| D4 | **Team-view mock:** delete all three mock arrays, wire SWR hooks against real APIs. |
| D5 | **Storage key:** admin keys (`zn_admin_permissions`, `zn_admin_enable_permission`). permission.js must switch to these. |
| D6 | **Permission code audit:** keep what's used, **prune the rest**, add missing per-module codes. |
| D7 | **Audit log stays the default team-view tab.** |
| D8 | **Block/unblock uses `user.update`** (single code, not fine-grained). |
| D9 | **Dev fallback:** `enablePermission=false` → bypass (returns `true` for every `hasPermission` call). |

## 4. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  src/utils/permission.js  (source of truth)                 │
│    - `permission` const: code registry (new, pruned)        │
│    - `menuPermissions`: route key → required codes[]        │
│    - `hasPermission(codes[])`: OR check                     │
│    - `enablePermission()`: reads zn_admin_enable_permission │
│    - `getPermissionCodes()`: reads zn_admin_permissions     │
└─────────────────────────────────────────────────────────────┘
           ▲ import { permission, hasPermission }
           │
┌─────────────────────────────────────────────────────────────┐
│  src/subs/admin/<module>/permissions.js  (14 files)         │
│    export const can = {                                     │
│      list:    hasPermission([permission.<module>_list]),    │
│      create:  hasPermission([permission.<module>_create]),  │
│      update:  hasPermission([permission.<module>_update]),  │
│      delete:  hasPermission([permission.<module>_delete]),  │
│      ...                                                    │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
           ▲ import { can } from '../permissions'
           │
┌─────────────────────────────────────────────────────────────┐
│  UI (view / sections)                                       │
│    {can.create && <Button>Tạo mới</Button>}                 │
│    {can.delete && <MenuItem onClick={onDel}>Xoá</MenuItem>} │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Sidebar — ADMIN_NAV_GROUPS (shared/tokens.js)              │
│    item.permissions: menuPermissions.<key>                  │
│  Admin layout filter:                                       │
│    groups.map(g => ({                                       │
│      ...g,                                                  │
│      items: g.items.filter(i =>                             │
│        !i.permissions || hasPermission(i.permissions)       │
│      )                                                      │
│    })).filter(g => g.items.length > 0)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Login flow                                                 │
│    actionLogin() → BE: { token, user, role, permissions,    │
│                          preferences, enable_permission }   │
│    setSession(token)                                        │
│    persistUserInfo({ user, role, permissions,               │
│                      preferences, enablePermission })       │
│    → localStorage.setItem('zn_admin_permissions', ...)      │
│    → localStorage.setItem('zn_admin_enable_permission',     │
│                           String(enablePermission))         │
└─────────────────────────────────────────────────────────────┘
```

## 5. Permission code registry (final shape)

**Modules × actions** (14 modules, action set per module):

| Module | Codes |
|---|---|
| global | `global.admin`, `global.default` |
| dashboard | `dashboard.view` |
| articles | `article.list`, `article.create`, `article.update`, `article.delete`, `article.publish`, `article.export`, `article.view_any` |
| featured_articles | `featured_articles.list`, `featured_articles.create`, `featured_articles.update`, `featured_articles.delete` |
| editorial_calendar | `editorial_calendar.view` |
| campaigns | `campaigns.list`, `campaigns.create`, `campaigns.update`, `campaigns.delete`, `campaigns.view_any` |
| catalog | `catalog.list`, `catalog.create`, `catalog.update`, `catalog.delete` |
| leads | `lead.list`, `lead.create`, `lead.update`, `lead.delete`, `lead.export`, `lead.import`, `lead.assign`, `lead.view_any` |
| newsletter | `newsletter.list`, `newsletter.create`, `newsletter.update`, `newsletter.delete`, `newsletter.send` |
| platform_updates | `platform_updates.list`, `platform_updates.create`, `platform_updates.update`, `platform_updates.delete`, `platform_updates.publish` |
| seo_scripts | `seo_scripts.list`, `seo_scripts.create`, `seo_scripts.update`, `seo_scripts.delete` |
| site_content | `site_content.list`, `site_content.update` |
| sessions | `sessions.list`, `sessions.revoke` |
| settings | `settings.view`, `settings.update` |
| team (users) | `user.list`, `user.create`, `user.update`, `user.delete`, `user.view_any` |
| team (roles) | `roles.list`, `roles.create`, `roles.update`, `roles.delete`, `roles.view_any` |
| team (user_roles) | `user_roles.list`, `user_roles.create`, `user_roles.update`, `user_roles.delete`, `user_roles.view_any` |
| team (audit) | `audit.view` |

**Codes to delete** (CRM-only, not applicable here):
`customer_*`, `contract_*`, `warning_*`, `debt_*`, `debt_payment_*`, `shop_*`, `shop_advertise_account_*`, `shop_budgets_*`, `provider_token_*`, `system_setting_*`, `pipeline_missions_*`, `pipelines_missions_group_*`, `pipeline_configs_*`, `user_organization_*`, `user_branches_*`, `invoice_*`, `user_resend_verify_email`, `user_block` (merged into `user.update` per D8).

## 6. Per-module `can` shape

```jsx
// src/subs/admin/articles/permissions.js
import { permission, hasPermission } from 'src/utils/permission';

export const can = {
    list:     hasPermission([permission.article_list, permission.article_view_any]),
    create:   hasPermission([permission.article_create]),
    update:   hasPermission([permission.article_update]),
    delete:   hasPermission([permission.article_delete]),
    publish:  hasPermission([permission.article_publish]),
    export:   hasPermission([permission.article_export]),
};
```

Minimum fields per module (if the module has no publish/export etc. just omit). Dashboard / editorial-calendar / sessions / site-content have smaller shapes.

**Caveat: `hasPermission` is evaluated at import time.** The `can` object is a frozen snapshot of the user's codes at the moment the module file first loaded. For an SPA this is fine — the user signs in once, codes don't change mid-session. Change-of-permission requires a page reload, documented in the module header comment.

## 7. Component / file inventory

### 7.1 Permission registry
- `src/subs/admin/auth/permission.js` — already correct. Only extend if Task 5 surfaces missing action codes.
- `src/utils/permission.js` — delete orphan. Also remove its import from `src/components/nav-section/vertical/nav-list.jsx` (replace with a stub `hasPermission = () => true` for the non-admin nav path, or delete the import if nav-section is also unused).

### 7.2 Create (14 files)
- `src/subs/admin/<module>/permissions.js` for each of: articles, featured-articles, editorial-calendar, campaigns, catalog, leads, newsletter, platform-updates, seo-scripts, sessions, settings, site-content, dashboard, team.

### 7.3 Edit — Admin layout sidebar
- `src/subs/admin/shared/tokens.js` — verify every `ADMIN_NAV_GROUPS` item has `permissions`; add where missing.
- `src/subs/admin/shared/sidebar.jsx` — add the filter described in §4 before iterating groups. (Confirmed to be the sole consumer of `ADMIN_NAV_GROUPS`.)

### 7.4 Edit — Team view
- `src/subs/admin/team/view/team-view.jsx` — delete `ROLES`, `USERS`, `AUDIT_LOGS` arrays. Keep `AUDIT_TYPES` (metadata, not data). Wire the four tabs to `useGetAuditLogList`, `useGetUserList + useGetUserStatusCount`, `useGetRoleList`, `useGetPermissionMatrix`. Loading → skeleton, empty → `AdminEmptyState`, error → toast + manual-refetch button.

### 7.5 Edit — Auth bootstrap
- `src/subs/admin/auth/auth-provider.jsx` — uncomment the persistUserInfo call at lines 30-33, pass `permissions` and `enablePermission` from the `/auth/me` response.
- Verify `src/subs/admin/auth/session.js`'s `persistUserInfo({ permissions, enablePermission })` writes both `zn_admin_permissions` and `zn_admin_enable_permission` localStorage keys.

### 7.6 Edit — Per-module UI (import `{ can }` and guard)
Each of the 14 modules has 1-3 UI files to touch (list view, bulk bar, editor drawer/dialog, row menu). The exact actions to guard are enumerated in the implementation plan (writing-plans output).

Typical touch per module:
- **List view**: `can.create` on "Tạo mới" primary button; `can.export` on export; `can.delete` on bulk delete bar.
- **Row menu**: `can.update` on "Chỉnh sửa"; `can.delete` on "Xoá"; `can.publish` on "Xuất bản" where relevant.
- **Editor drawer**: `can.delete` on delete button in header, `can.update` controls whether submit button renders at all when editing an existing item (`can.create` controls new-item submit).

## 8. Error / edge cases

- **BE returns no `permissions` field** — login handler defaults `enablePermission` to `false` → `hasPermission()` returns `true` → UI unguarded. Dev convenience; prod BE must always return `permissions` + `enable_permission: true` to actually enforce.
- **BE returns `permissions: []` with `enable_permission: true`** — user sees nothing except pages that have no `permissions` guard. Explicit intent.
- **User's permissions change server-side mid-session** — `can` snapshot stale. Documented limitation; UX pattern is: user logs out and back in. Not solved in this phase.
- **A module file not touched by implementation** — its UI remains unguarded. Not an error, just unfinished. Caught by the per-module checklist in the implementation plan.
- **Sidebar group becomes empty after filtering** — group header is hidden too (filter condition includes `.length > 0`).
- **Toggling `zn_admin_enable_permission` in devtools** — takes effect on next page load (snapshot semantics).

## 9. Testing

No automated tests. Manual verification:

1. Clear localStorage, log in with a mocked `/auth/me` response that returns `enable_permission: true` and a specific subset of permissions (e.g. only `article.list`, `article.create`). Confirm:
   - Sidebar shows only the Articles entry.
   - Articles list shows the "Tạo mới" button.
   - Articles list hides the row-menu "Xoá".
   - Editing an article: submit button hidden (no `article.update`).
2. Set `zn_admin_enable_permission` to `'false'` in devtools, reload. Confirm every button is visible.
3. For each of the 14 modules, with no permissions set and `enable_permission: true`, confirm no create/update/delete/export action is visible.
4. Team-view: with mocked API responses, confirm each tab renders list from API; empty → empty state; API throws → error toast + "Thử lại" button.

## 10. Rollout order

Implemented sequentially (no parallelism needed, all touches are read-after-write safe):

1. Rewrite `src/utils/permission.js` (registry + menuPermissions + storage key fix).
2. Verify + update sidebar `ADMIN_NAV_GROUPS` permissions coverage.
3. Add the sidebar filter in the admin layout component.
4. Fix auth-provider to persist permissions on `/auth/me`.
5. Create the 14 `permissions.js` files (concurrent-safe but kept sequential for review clarity).
6. Attach `{can.*}` guards module by module (14 modules).
7. Clean `team-view.jsx` and wire real APIs.
8. Manual-verify sidebar + each module per §9.

Order matters only for step 1 → everything else; the registry has to exist before the per-module files reference it.

---
