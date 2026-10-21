// @ts-nocheck

/** Keep selected options in the panel when local search hides other mat-options (Material drops off-DOM selections). */
export function mergeMultiSelectPanelOptions<T>(
  filtered: T[],
  fullList: T[],
  selectedIds: number[],
  getId: (item: T) => number
): T[] {
  const map = new Map<number, T>();
  (filtered || []).forEach((item) => {
    const id = Number(getId(item));
    if (Number.isFinite(id) && id > 0) {
      map.set(id, item);
    }
  });
  (selectedIds || []).forEach((rawId) => {
    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0 || map.has(id)) {
      return;
    }
    const found = (fullList || []).find((item) => Number(getId(item)) === id);
    if (found) {
      map.set(id, found);
    }
  });
  return Array.from(map.values());
}

export function filterListByTerm<T>(list: T[], term: string, getLabel: (item: T) => string): T[] {
  const normalized = (term || '').trim().toLowerCase();
  if (!normalized) {
    return list || [];
  }
  return (list || []).filter((item) => (getLabel(item) || '').toLowerCase().includes(normalized));
}

export function sortByString<T>(list: T[], getLabel: (item: T) => string): T[] {
  return [...(list || [])].sort((a, b) => (getLabel(a) || '').localeCompare(getLabel(b) || ''));
}

export function pruneSelectedIds(ids: number[], availableIds: number[]): number[] {
  const available = new Set((availableIds || []).map(Number).filter((id) => id > 0));
  return (ids || []).map(Number).filter((id) => Number.isFinite(id) && id > 0 && available.has(id));
}

export function selectionSpecificIds(selected: number[], allToken: number): number[] {
  return (selected || []).map(Number).filter((id) => Number.isFinite(id) && id > 0 && id !== allToken);
}

export function selectionIncludesAllToken(selected: number[], allToken: number): boolean {
  return (selected || []).some((id) => Number(id) === allToken);
}

function uniquePositiveIds(ids: number[]): number[] {
  return [...new Set((ids || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
}

/** Selecting All checks every row; model holds all IDs plus the All token. */
export function buildSelectAllSelection(
  previousSelected: number[],
  nextSelected: number[],
  allToken: number,
  allEntityIds: number[]
): number[] {
  const prev = (previousSelected || []).map(Number);
  const next = (nextSelected || []).map(Number);
  const allUnique = uniquePositiveIds(allEntityIds);
  const hadAll = selectionIncludesAllToken(prev, allToken);
  const hasAll = selectionIncludesAllToken(next, allToken);
  const nextSpecifics = selectionSpecificIds(next, allToken);

  if (hadAll && !hasAll) {
    return [];
  }
  if (!hadAll && hasAll) {
    return allUnique.length ? [allToken, ...allUnique] : [allToken];
  }
  if (hasAll && nextSpecifics.length < allUnique.length) {
    return nextSpecifics;
  }
  if (
    !hasAll &&
    allUnique.length &&
    nextSpecifics.length >= allUnique.length &&
    allUnique.every((id) => nextSpecifics.includes(id))
  ) {
    return [allToken, ...allUnique];
  }
  return nextSpecifics;
}

export function isFullSelectionSelected(
  selected: number[],
  allToken: number,
  allEntityIds: number[]
): boolean {
  const allUnique = uniquePositiveIds(allEntityIds);
  if (selectionIncludesAllToken(selected, allToken)) {
    return true;
  }
  if (!allUnique.length) {
    return false;
  }
  const specifics = selectionSpecificIds(selected, allToken);
  return specifics.length >= allUnique.length && allUnique.every((id) => specifics.includes(id));
}

export function isAllVehiclesSelected(
  selected: number[],
  allToken: number,
  vehicleIds: number[]
): boolean {
  return isFullSelectionSelected(selected, allToken, vehicleIds);
}

export function normalizeVehicleMultiSelectValue(
  value: number[],
  previousValue: number[],
  allToken: number,
  allVehicleIds: number[]
): number[] {
  return buildSelectAllSelection(previousValue, value, allToken, allVehicleIds);
}

export function normalizeMultiSelectWithAllToken(
  value: number[],
  previousValue: number[],
  allToken: number,
  allEntityIds: number[]
): number[] {
  return buildSelectAllSelection(previousValue, value, allToken, allEntityIds);
}

export function expandAllTokenSelection(value: any, allToken: number, allEntityIds: number[]): number[] {
  const raw = Array.isArray(value) ? value.map(Number) : [Number(value)];
  const allUnique = uniquePositiveIds(allEntityIds);
  if (selectionIncludesAllToken(raw, allToken) || isFullSelectionSelected(raw, allToken, allUnique)) {
    return allUnique;
  }
  return selectionSpecificIds(raw, allToken);
}

export function expandAllVehicleToken(value: any, allToken: number, allVehicleIds: number[]): number[] {
  return expandAllTokenSelection(value, allToken, allVehicleIds);
}

export function sameNumberList(a: number[] | null | undefined, b: number[] | null | undefined): boolean {
  const na = uniquePositiveIds(a || []);
  const nb = uniquePositiveIds(b || []);
  if (na.length !== nb.length) {
    return false;
  }
  const sa = [...na].sort((x, y) => x - y);
  const sb = [...nb].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}
