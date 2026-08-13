export const MARKETPLACE_PAGE_SIZE = 24;
export const MARKETPLACE_LOAD_MORE_THRESHOLD_PX = 900;

export function shouldLoadMoreMarketplace(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
): boolean {
  return viewportHeight + scrollY >= documentHeight - MARKETPLACE_LOAD_MORE_THRESHOLD_PX;
}
