export const FRAME_IDS = ['square', 'dogear', 'stacked', 'pill', 'barred'] as const
export type FrameId = (typeof FRAME_IDS)[number]
