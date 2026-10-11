export function shouldPreventSmoothScroll(node: HTMLElement): boolean {
  return node.closest('[role="dialog"], [cmdk-overlay], [data-lenis-prevent]') !== null
}
