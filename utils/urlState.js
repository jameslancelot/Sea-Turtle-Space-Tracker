/**
 * URL State Management Utilities
 * Handles encoding/decoding of filter state to/from URL parameters
 * for shareable deep links in Sea Turtle Space Tracker
 */

// Short parameter keys for clean URLs
export const PARAM_KEYS = {
  view: 'v',
  displayMode: 'd',
  yearFilter: 'y',
  monthFilter: 'm',
  rocketFilter: 'r',
  missionTypeFilter: 'mt',
  programFilter: 'pg',
  providerFilter: 'p',
  searchQuery: 'q',
  siteFilter: 's',
  showStats: 'st'
};

// Reverse mapping for decoding
const KEY_TO_STATE = Object.entries(PARAM_KEYS).reduce((acc, [state, param]) => {
  acc[param] = state;
  return acc;
}, {});

// Default values for all state variables
export const DEFAULT_VALUES = {
  view: 'upcoming',
  displayMode: 'cards',
  yearFilter: 'all',
  monthFilter: 'all',
  rocketFilter: 'all',
  missionTypeFilter: 'all',
  programFilter: 'all',
  providerFilter: 'all',
  searchQuery: '',
  siteFilter: null,
  showStats: true
};

/**
 * Check if a value matches the default (and should be omitted from URL)
 */
export const isDefaultValue = (key, value) => {
  const defaultVal = DEFAULT_VALUES[key];

  // Handle null/undefined
  if (value === null || value === undefined) {
    return defaultVal === null || defaultVal === undefined;
  }

  // Handle boolean
  if (typeof defaultVal === 'boolean') {
    return Boolean(value) === defaultVal;
  }

  // Handle strings
  return value === defaultVal;
};

/**
 * Validate a filter value against valid options
 * Returns the value if valid, or 'all'/null if invalid
 */
export const validateValue = (key, value, validOptions = {}) => {
  if (!value || value === 'all') return 'all';

  switch (key) {
    case 'view':
      return ['upcoming', 'past', 'all'].includes(value) ? value : 'upcoming';

    case 'displayMode':
      return ['cards', 'table', 'compact', 'map'].includes(value) ? value : 'cards';

    case 'yearFilter':
      if (value === 'all') return 'all';
      const year = parseInt(value, 10);
      return (validOptions.years && validOptions.years.includes(year)) ? year.toString() : 'all';

    case 'monthFilter':
      if (value === 'all') return 'all';
      // Format: YYYY-MM
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(value)) return 'all';
      return (validOptions.months && validOptions.months.includes(value)) ? value : 'all';

    case 'rocketFilter':
      if (value === 'all') return 'all';
      return (validOptions.rockets && validOptions.rockets.includes(value)) ? value : 'all';

    case 'missionTypeFilter':
      if (value === 'all') return 'all';
      return (validOptions.missionTypes && validOptions.missionTypes.includes(value)) ? value : 'all';

    case 'programFilter':
      if (value === 'all') return 'all';
      return (validOptions.programs && validOptions.programs.includes(value)) ? value : 'all';

    case 'providerFilter':
      if (value === 'all') return 'all';
      return (validOptions.providers && validOptions.providers.includes(value)) ? value : 'all';

    case 'searchQuery':
      // Allow any string, but limit length
      return typeof value === 'string' ? value.slice(0, 200) : '';

    case 'siteFilter':
      // Allow any string or null
      return value || null;

    case 'showStats':
      // Convert to boolean
      return value === 'true' || value === '1' || value === true;

    default:
      return value;
  }
};

/**
 * Encode filter state to URL parameters
 * Only includes non-default values for cleaner URLs
 */
export const encodeFilters = (state) => {
  const params = new URLSearchParams();

  Object.entries(PARAM_KEYS).forEach(([stateKey, paramKey]) => {
    const value = state[stateKey];

    // Skip default values to keep URLs clean
    if (isDefaultValue(stateKey, value)) {
      return;
    }

    // Convert value to string for URL
    let stringValue;
    if (value === null || value === undefined) {
      return; // Skip null/undefined
    } else if (typeof value === 'boolean') {
      stringValue = value ? '1' : '0';
    } else {
      stringValue = String(value);
    }

    params.set(paramKey, stringValue);
  });

  return params;
};

/**
 * Decode URL parameters to filter state
 * Validates all values and provides defaults for invalid/missing params
 */
export const decodeFilters = (urlParams, validOptions = {}) => {
  const state = { ...DEFAULT_VALUES };

  // Parse URL parameters
  urlParams.forEach((value, paramKey) => {
    const stateKey = KEY_TO_STATE[paramKey];

    if (stateKey) {
      // Validate and set the value
      state[stateKey] = validateValue(stateKey, value, validOptions);
    }
  });

  return state;
};

/**
 * Build a complete shareable URL with current filter state
 */
export const buildShareableURL = (state, baseURL = null) => {
  const params = encodeFilters(state);
  const url = baseURL || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

/**
 * Parse URL search string to state object
 */
export const parseURLToState = (searchString, validOptions = {}) => {
  const params = new URLSearchParams(searchString);
  return decodeFilters(params, validOptions);
};
