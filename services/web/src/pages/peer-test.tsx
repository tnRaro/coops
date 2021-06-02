import { Container, Heading, Select, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState, VoidFunctionComponent } from "react";

import { deviceIdAtom, devicesAtom } from "../app/atoms/deviceAtoms";
import { Option } from "../app/components/primitives/Option";
import { PeerList } from "../app/components/primitives/Peer";
import { useMediaDevices } from "../app/hooks/useMediaDevices";
import { createParticipant } from "../app/queries/participants";
import { getRoom } from "../app/queries/rooms";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  useMediaDevices();
  const [deviceId, setDeviceId] = useAtom(deviceIdAtom);
  const [devices, setDevices] = useAtom(devicesAtom);
  const [participant, setParticipant] = useState<{
    nickname: string;
    peerId: string;
    participantId: string;
  } | null>(null);
  const [participants, setParticipants] = useState<
    { nickname: string; peerId: string }[]
  >([]);
  const roomId = "R6D2YU";
  useEffect(() => {
    setTimeout(async () => {
      const nickname = Math.random().toString().slice(0, 6);
      const participant = await createParticipant(roomId, nickname);
      setParticipant(participant);
    });
  }, []);
  useEffect(() => {
    setTimeout(async () => {
      if (participant?.participantId == null) {
        return;
      }
      const room = await getRoom(roomId, participant.participantId);
      setParticipants(room.participants);
      // eslint-disable-next-line no-console
      console.info(room.participants);
    });
  }, [participant?.participantId]);
  return (
    <Container>
      <Heading>Work in Progress</Heading>
      <VStack>
        <Select
          value={deviceId ?? 0}
          onChange={(event) => setDeviceId(event.target.value)}
        >
          {devices.map((device) => (
            <Option key={device.deviceId}>{device.label}</Option>
          ))}
        </Select>
      </VStack>
      {participant?.peerId != null && participant?.nickname != null && (
        <PeerList
          nickname={participant.nickname}
          participants={participants}
          peerId={participant.peerId}
        />
      )}
    </Container>
  );
};
export default Page;
