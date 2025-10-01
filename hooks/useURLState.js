import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  encodeFilters,
  decodeFilters,
  buildShareableURL,
  DEFAULT_VALUES
} from '../utils/urlState';

/**
 * Custom hook for bidirectional URL ↔ state synchronization
 * Enables shareable deep links with filter state preservation
 *
 * @param {Object} setters - Object containing all state setter functions
 * @param {Object} currentState - Object containing all current state values
 * @param {Object} validOptions - Object containing valid filter options (rockets, providers, etc.)
 * @returns {Object} - { getShareableURL: function }
 */
export const useURLState = (setters, currentState, validOptions) => {
  const router = useRouter();
  const isInitialized = useRef(false);
  const isUpdatingFromURL = useRef(false);
  const searchDebounceTimer = useRef(null);

  /**
   * Initialize state from URL parameters on mount
   */
  useEffect(() => {
    // Wait for router to be ready and client-side rendering
    if (!router.isReady || isInitialized.current || typeof window === 'undefined') return;

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const stateFromURL = decodeFilters(urlParams, validOptions || {});

    // Check if URL has any parameters
    const hasParams = urlParams.toString().length > 0;

    if (hasParams) {
      // Apply state from URL using setters
      isUpdatingFromURL.current = true;

      Object.entries(stateFromURL).forEach(([key, value]) => {
        const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        const setter = setters[setterName];

        if (setter && value !== DEFAULT_VALUES[key]) {
          setter(value);
        }
      });

      // Reset flag after state updates
      setTimeout(() => {
        isUpdatingFromURL.current = false;
      }, 100);
    }

    isInitialized.current = true;
  }, [router.isReady, setters, validOptions]);

  /**
   * Update URL when state changes (with debouncing for search)
   */
  useEffect(() => {
    // Skip if not initialized or currently updating from URL
    if (!isInitialized.current || isUpdatingFromURL.current) return;

    // Debounce search query updates
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    const updateURL = () => {
      const params = encodeFilters(currentState);
      const queryString = params.toString();
      const newPath = queryString ? `?${queryString}` : router.pathname;

      // Only update if URL actually changed
      const currentQuery = new URLSearchParams(window.location.search).toString();
      if (queryString !== currentQuery) {
        router.push(newPath, undefined, { shallow: true });
      }
    };

    // Debounce search query changes (300ms), update others immediately
    const previousSearchQuery = useRef(currentState.searchQuery);
    const searchQueryChanged = previousSearchQuery.current !== currentState.searchQuery;
    previousSearchQuery.current = currentState.searchQuery;

    if (searchQueryChanged) {
      searchDebounceTimer.current = setTimeout(updateURL, 300);
    } else {
      updateURL();
    }

    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [
    currentState.view,
    currentState.displayMode,
    currentState.yearFilter,
    currentState.monthFilter,
    currentState.rocketFilter,
    currentState.missionTypeFilter,
    currentState.programFilter,
    currentState.providerFilter,
    currentState.searchQuery,
    currentState.siteFilter,
    currentState.showStats,
    router
  ]);

  /**
   * Handle browser back/forward navigation
   */
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Parse new URL
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const stateFromURL = decodeFilters(urlParams, validOptions || {});

      // Update state from URL
      isUpdatingFromURL.current = true;

      Object.entries(stateFromURL).forEach(([key, value]) => {
        const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        const setter = setters[setterName];

        if (setter) {
          setter(value);
        }
      });

      setTimeout(() => {
        isUpdatingFromURL.current = false;
      }, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, setters, validOptions]);

  /**
   * Get shareable URL with current filter state
   */
  const getShareableURL = useCallback(() => {
    return buildShareableURL(currentState);
  }, [currentState]);

  return {
    getShareableURL
  };
};

export default useURLState;
