// src/actions/admin/menu.js — menu hooks (mock-driven, API-ready)

import { useMemo } from 'react';

import {
  menuLocations,
  serviceCallouts,
  menuTreeByLocation,
  resolveCallouts,
} from 'src/mock-data/menu';

// Giữ chữ ký tương tự các hook admin khác: trả về object + `loading` cho view dễ guard.

export const useGetMenuLocationList = () =>
  useMemo(
    () => ({
      locations: menuLocations,
      searchResults: menuLocations,
      counts: {
        all: menuLocations.length,
        active: menuLocations.filter((l) => l.is_active).length,
      },
      loading: false,
      error: null,
    }),
    []
  );

export const useGetMenuTree = (location) =>
  useMemo(() => {
    const tree = menuTreeByLocation[location] ?? [];
    return {
      tree,
      items: tree,
      loading: false,
      error: null,
    };
  }, [location]);

export const useGetMegaPanel = (location, primaryId) =>
  useMemo(() => {
    const tree = menuTreeByLocation[location] ?? [];
    const item = tree.find((it) => it.id === primaryId);
    const panel = item?.panel ?? null;
    return {
      item,
      panel,
      callouts: resolveCallouts(panel?.service_callouts ?? []),
      loading: false,
      error: null,
    };
  }, [location, primaryId]);

export const useGetServiceCallouts = () =>
  useMemo(
    () => ({
      callouts: serviceCallouts,
      loading: false,
      error: null,
    }),
    []
  );

// Helper trả về "location kind": mega_* → 'mega', footer_* → 'footer', ...
export const getLocationKind = (location) => {
  if (!location) return 'other';
  if (location.startsWith('mega_')) return 'mega';
  if (location.startsWith('footer_')) return 'footer';
  if (location.startsWith('header_')) return 'header';
  if (location === 'mobile') return 'mobile';
  return 'other';
};
