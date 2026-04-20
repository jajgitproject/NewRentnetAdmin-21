# Bootstrap Modal Migration Plan (Page-by-Page)

## Goal
- Replace legacy Bootstrap/jQuery modal triggers (`data-toggle="modal"`) with Angular-managed dialogs.
- Remove global runtime scripts from `src/index.html` only after migration is complete:
  - jQuery
  - Popper
  - Bootstrap JS

## Scope Baseline
- Run `npm run modal:report` to generate `docs/modal-migration-report.json`.
- The report is the source of truth for remaining pages.

## Phased Rollout

### Phase 1 - Pilot (done/active)
- Validate migration path on one representative page (`role`).
- Ensure visual parity against legacy popup layout.
- Confirm no regressions in search behavior and table load.

### Phase 2 - CRUD Search Pages (high-volume)
- Migrate pages following the common pattern:
  - Search trigger button with `data-toggle="modal"`
  - `#exampleModalCenter` popup with 1-2 form fields + Search button
- Batch size: 10-15 pages per PR/chunk.
- Validate each batch manually in UI.

### Phase 3 - Complex/Custom Modals
- Migrate pages with custom footer logic, nested inputs, or additional modal actions.
- Add page-specific fixes for styling parity.

### Phase 4 - Script Removal
- Preconditions:
  - `docs/modal-migration-report.json.totalFilesWithBootstrapModalTriggers === 0`
  - smoke test key pages
- Remove from `src/index.html`:
  - jQuery script
  - Popper script
  - Bootstrap JS script

## Verification Checklist per Batch
- Search button opens popup.
- Labels/fields render without clipping.
- Search action applies filters correctly.
- Close/Cancel behaves correctly.
- No console errors.
