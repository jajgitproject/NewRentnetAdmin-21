# Customer Group Reservation Capping — filters, selection, bulk edit

## Prerequisites
- Run DB migration `rentnetAPI/SqlScripts/CustomerGroupReservationCapping_CappingType_VehicleID.sql` for full filter-by-capping-type and vehicle behavior.
- Rebuild and restart API + Angular admin.

## Manual checks
1. Open list from customer group (encrypted query params). No list API until **Capping Type** is selected; hint text shown.
2. Select Capping Type → grid loads. Change Package / City / Vehicle / Status → reload; row selection clears.
3. **Reset** clears filters except Status → Active; Capping Type cleared; table hidden.
4. City dropdown: type in panel → local filter; empty → "No city found".
5. **Add**: Capping Type required (no default); searchable city multi-select; create still saves.
6. Row **Edit**: weekday caps only (keys read-only as before).
7. Select rows → **Edit Selected (N)** → bulk dialog; Day Capping + Active/Deactive; save updates all seven caps to same value + status.
8. Bulk: reject empty or negative Day Capping.
9. Delete from row menu still works.

## API endpoints
- `GET .../customerGroupReservationCapping/Filter/{CustomerGroupID}/{CappingType}/...`
- `PUT .../customerGroupReservationCapping/bulk-update` body `{ ids, dayCapping, isActive, userID }`
