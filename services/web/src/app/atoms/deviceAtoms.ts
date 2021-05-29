import { atom } from "jotai";

export const devicesAtom = atom<MediaDeviceInfo[]>([]);
export const deviceIdAtom = atom<string | null>(null);
