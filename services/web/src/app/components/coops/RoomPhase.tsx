import { SmallCard } from "../core/SmallCard";
import { Flex } from "../primitives/Flex";
import { Heading4 } from "../primitives/Heading";

import { InviteCodeCard } from "./cards/InviteCodeCard";
import { ParticipantListCard } from "./cards/ParticipantListCard";
import { RoomDetailCard } from "./cards/RoomDetailCard";
import { ChatListCard } from "./cards/ChatListCard";

interface RoomRhaseProps {}
export const RoomRhase: React.VFC<RoomRhaseProps> = () => {
  const direction = "horizontal";
  return (
    <Flex direction={direction} gap="10" css={{ flex: 1 }}>
      <Flex direction="vertical" gap="10" css={{ flex: "0 1 480px" }}>
        <SmallCard css={{ background: "$cardGradient" }}>
          <InviteCodeCard />
        </SmallCard>
        <SmallCard>
          <ParticipantListCard />
        </SmallCard>
        <SmallCard>
          <Heading4>음성 설정</Heading4>
          <Heading4>방 설정</Heading4>
        </SmallCard>
      </Flex>
      <Flex direction="vertical" gap="10" css={{ flex: "1 1 480px" }}>
        <SmallCard css={{ background: "$cardGradient" }}>
          <RoomDetailCard />
        </SmallCard>
        <SmallCard css={{ flex: "1" }}>
          <ChatListCard />
        </SmallCard>
      </Flex>
    </Flex>
  );
};
