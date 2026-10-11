export type MotionPref = 'on' | 'paused'

type StorageLike = Pick<Storage, 'getItem'>
type StorageWriter = Pick<Storage, 'setItem' | 'removeItem'>
type RootLike = {
  setAttribute: (name: string, value: string) => void
  removeAttribute: (name: string) => void
}

const KEY = 'motion-pref'

export function readMotionPref(storage?: StorageLike): MotionPref {
  try {
    return storage?.getItem(KEY) === 'paused' ? 'paused' : 'on'
  } catch {
    return 'on'
  }
}

export function writeMotionPref(pref: MotionPref, storage?: StorageWriter): void {
  if (!storage) return
  try {
    if (pref === 'paused') storage.setItem(KEY, 'paused')
    else storage.removeItem(KEY)
  } catch {
    return
  }
}

export function applyMotionPref(pref: MotionPref, root: RootLike): void {
  if (pref === 'paused') root.setAttribute('data-motion', 'paused')
  else root.removeAttribute('data-motion')
}
