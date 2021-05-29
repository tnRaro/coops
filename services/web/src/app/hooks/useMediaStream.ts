import { useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useEffect } from "react";

import { deviceIdAtom, devicesAtom } from "../atoms/deviceAtoms";

export const getMediaStream = async (deviceId: string) => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
    });
    return mediaStream;
  } catch (error) {
    if (error instanceof DOMException) {
      console.error(error);
    } else {
      console.error(error);
    }
  }
};

export const useMediaDevices = () => {
  const [devices, setDevices] = useAtom(devicesAtom);
  const setDeviceId = useUpdateAtom(deviceIdAtom);
  useEffect(() => {
    if (globalThis !== window) return;
    const deviceChangeHandler = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices.filter((device) => device.kind === "audioinput"));
    };
    deviceChangeHandler();
    navigator.mediaDevices.addEventListener(
      "devicechange",
      deviceChangeHandler,
    );
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        deviceChangeHandler,
      );
    };
  }, [setDevices]);
  useEffect(() => {
    setDeviceId((deviceId) =>
      deviceId == null || devices.some((device) => device.deviceId === deviceId)
        ? devices[0]?.deviceId
        : deviceId,
    );
  }, [devices, setDeviceId]);
};
