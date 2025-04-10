import { getLastPathnameFromUrl } from '../getLastPathnameFromUrl';
import { kebabToUpperCase } from '../kebabToUpperCase';
import { removeAnchorIdFromPathname } from '../removeAnchorIdFromPathname';

export function getIntent(): string {
  const lastPathname = getLastPathnameFromUrl(window.location.href);
  const lastPathnameWithoutAnchorId = removeAnchorIdFromPathname(lastPathname);

  return kebabToUpperCase(lastPathnameWithoutAnchorId);
}
