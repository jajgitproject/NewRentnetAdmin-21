# Car and Driver Allotment — Performance Baseline

Screen: `/#/CarAndDriverAllotment?reservationID=<id>`

## What to measure

Record **Network tab** timings (ms) for these calls on a typical reservation (e.g. 27316):

| Phase | API | Notes |
|-------|-----|-------|
| Init | `controlPanel/getShowAllLocationCheck` | Still required before grid |
| Critical (before) | `controlPanel/getReservationDetailsForAllotment` (PUT) | **Replaced** by lite GET on critical path |
| Critical (after) | `controlPanel/getReservationDetailsForAllotmentLite/{id}` | Blocks grid start |
| Critical | `driverInventoryAssociation/SearchForDriverInventoryUnassociation` | Grid data |
| Deferred | Dropdown APIs (`Inventory/ForDropDown`, `driver/...`, `supplier/...`, etc.) | Only after Advance Search opens |
| Background | `getReservationDetailsForAllotment` (PUT) | Full header enrichment after grid |

## Dev console perf marks

In non-production builds, open DevTools Console and filter `[AllotmentPerf]`.

Marks emitted (elapsed from `allotment_load_start`):

- `allotment_location_check_loaded`
- `allotment_lite_request` / `allotment_lite_loaded`
- `allotment_grid_loaded`
- `allotment_restrictions_loaded`
- `allotment_full_reservation_loaded`

Example:

```
[AllotmentPerf] allotment_lite_loaded (+420ms)
[AllotmentPerf] allotment_grid_loaded (+2100ms)
```

## Baseline template (fill before/after deploy)

| Metric | Before (ms) | After (ms) | Target |
|--------|-------------|------------|--------|
| Location check | | | |
| Reservation header (critical path) | | | < 500 |
| Grid search (20 rows) | | | < 2000 |
| Time to grid visible | | | |
| Dropdown burst on init | 8 calls | 0 (lazy) | 0 on init |
| Row expand (restrictions) | 2× per row | 0 (cached) | < 1000 total |

## How to capture

1. Hard refresh allotment page with a known reservation ID.
2. Network tab → disable cache → reload.
3. Sort by **Duration**; note the three critical APIs above.
4. Copy console `[AllotmentPerf]` lines for the same load.
5. Expand one driver row; note duty + feedback calls (restrictions should not repeat).

## Changes that affect measurement

- Page size: **20** rows (was 50).
- Grid count: `SELECT COUNT(1)` instead of full query materialization.
- Duty columns in grid SQL: deferred (`NULL` in SELECT; duty loaded on row expand).
- Reservation lite API: single JOIN query, no N+1 child queries on critical path.
