import type { FilterGroup, FilterState } from "./filter-types";

const PAGE_PARAM = "page";

export const splitFilterValues = (value?: string): string[] =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export const removeFilterParam = <T extends FilterState>(state: T, key: string): T => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...rest } = state;
  return rest as T;
};

export const resetToFirstPage = <T extends FilterState>(state: T): T => {
  if (!(PAGE_PARAM in state)) {
    return state;
  }

  return {
    ...state,
    [PAGE_PARAM]: "1",
  } as T;
};

export const getGroupSelectedCount = (
  state: FilterState,
  group: FilterGroup,
): number => {
  if (group.type === "range" && group.range) {
    return (
      Number(Boolean(state[group.range.fromParam])) +
      Number(Boolean(state[group.range.toParam]))
    );
  }

  const values = splitFilterValues(state[group.paramKey]);
  if (group.type === "single") {
    return values[0] ? 1 : 0;
  }

  return values.length;
};

export const countSelectedFilters = (
  state: FilterState,
  groups: FilterGroup[],
): number =>
  groups.reduce((count, group) => count + getGroupSelectedCount(state, group), 0);

export const updateOptionFilter = (
  state: FilterState,
  group: FilterGroup,
  optionValue: string,
  checked: boolean,
): FilterState => {
  const next = resetToFirstPage({ ...state });

  if (group.type === "range") {
    return next;
  }

  if (group.type === "multi") {
    const currentValues = splitFilterValues(next[group.paramKey]);
    const updatedValues = checked
      ? Array.from(new Set([...currentValues, optionValue]))
      : currentValues.filter((value) => value !== optionValue);

    if (updatedValues.length === 0) {
      return removeFilterParam(next, group.paramKey);
    }

    return {
      ...next,
      [group.paramKey]: updatedValues.join(","),
    };
  }

  if (!optionValue || !checked) {
    return removeFilterParam(next, group.paramKey);
  }

  return {
    ...next,
    [group.paramKey]: optionValue,
  };
};

export const updateRangeFilter = (
  state: FilterState,
  group: FilterGroup,
  updates: { from?: string; to?: string },
): FilterState => {
  if (group.type !== "range" || !group.range) {
    return state;
  }

  let next = resetToFirstPage({ ...state });

  if ("from" in updates) {
    if (updates.from) {
      next[group.range.fromParam] = updates.from;
    } else {
      next = removeFilterParam(next, group.range.fromParam);
    }
  }

  if ("to" in updates) {
    if (updates.to) {
      next[group.range.toParam] = updates.to;
    } else {
      next = removeFilterParam(next, group.range.toParam);
    }
  }

  return next;
};

export const clearFilterGroups = (
  state: FilterState,
  groups: FilterGroup[],
): FilterState => {
  let next = resetToFirstPage({ ...state });

  groups.forEach((group) => {
    if (group.type === "range" && group.range) {
      if (group.range.fromParam in next) {
        next = removeFilterParam(next, group.range.fromParam);
      }
      if (group.range.toParam in next) {
        next = removeFilterParam(next, group.range.toParam);
      }
      return;
    }

    if (group.paramKey in next) {
      next = removeFilterParam(next, group.paramKey);
    }
  });

  return next;
};

export const areFilterStatesEqual = (
  left: FilterState,
  right: FilterState,
): boolean => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (left[key] !== right[key]) {
      return false;
    }
  }

  return true;
};
