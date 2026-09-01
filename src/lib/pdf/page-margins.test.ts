
import { getPdfLayoutProfile } from './layout-profile';
import {
  PDF_FRAGMENT_PADDING_FLOOR_PX,
  PDF_SAFE_PAGE_MARGIN_MM,
  PDF_SAFE_PAGE_MARGIN_PX,
  resolvePdfPageMargins,
  usesPhysicalPdfPageMargins,
} from './page-margins';
import { test, expect } from 'vitest';

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

test('background templates use physical safe page margins', () => {
  const profile = getPdfLayoutProfile('gradient');
  const margins = resolvePdfPageMargins(profile, defaultMargin);

  expect(usesPhysicalPdfPageMargins(profile)).toBe(true);
  expect(margins.usesPhysicalMargins).toBe(true);
  expect(margins.topPx).toBe(PDF_SAFE_PAGE_MARGIN_PX);
  expect(margins.bottomPx).toBe(PDF_SAFE_PAGE_MARGIN_PX);
  expect(margins.topMm).toBe(PDF_SAFE_PAGE_MARGIN_MM);
  expect(margins.bottomMm).toBe(PDF_SAFE_PAGE_MARGIN_MM);
  expect(margins.css).toBe('10mm 0 10mm 0');
});

test('standard templates keep larger user margins while enforcing the safe minimum', () => {
  const margins = resolvePdfPageMargins(getPdfLayoutProfile('classic'), {
    top: 48,
    right: 20,
    bottom: 44,
    left: 20,
  });

  expect(margins.topPx).toBe(48);
  expect(margins.bottomPx).toBe(44);
  expect(margins.css).toBe('12.7mm 0 11.6mm 0');
});

test('sidebar and full-dark templates keep physical page margins at zero', () => {
  const sidebarMargins = resolvePdfPageMargins(getPdfLayoutProfile('sidebar'), defaultMargin);
  const neonMargins = resolvePdfPageMargins(getPdfLayoutProfile('neon'), defaultMargin);

  expect(sidebarMargins.usesPhysicalMargins).toBe(false);
  expect(sidebarMargins.css).toBe('0');
  expect(sidebarMargins.fragmentPaddingFloorPx).toBe(PDF_FRAGMENT_PADDING_FLOOR_PX);

  expect(neonMargins.usesPhysicalMargins).toBe(false);
  expect(neonMargins.css).toBe('0');
  expect(neonMargins.fragmentPaddingFloorPx).toBe(PDF_FRAGMENT_PADDING_FLOOR_PX);
});
