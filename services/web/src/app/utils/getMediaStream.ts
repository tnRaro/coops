export const getMediaStream = async (deviceId: string) => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
    });
    return mediaStream;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};
