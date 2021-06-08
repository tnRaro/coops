/* eslint-disable @shopify/jsx-no-complex-expressions */
import { useAtom } from "jotai";
import React from "react";
import {
  RiVipCrownFill,
  RiUserFill,
  RiMicFill,
  RiHeadphoneFill,
  RiSettings3Fill,
} from "react-icons/ri";

import { participantsAtom } from "../../../atoms";
import { Participant } from "../../../types";
import { Flex } from "../../primitives/Flex";
import { Heading4 } from "../../primitives/Heading";
import { Spacer } from "../../primitives/Spacer";
import { Text } from "../../primitives/Text";

interface ParticipantItemProps extends Participant {}
export const ParticipantItem: React.VFC<ParticipantItemProps> = (props) => {
  return (
    <Flex gap="10" align="center">
      {props.isHost ? <RiVipCrownFill /> : <RiUserFill />}
      <Text>{props.nickname}</Text>
      <Spacer />
      <Flex gap="16">
        <RiMicFill />
        <RiHeadphoneFill />
        <RiSettings3Fill />
      </Flex>
    </Flex>
  );
};

interface ParticipantListCardProps {}
export const ParticipantListCard: React.VFC<ParticipantListCardProps> = () => {
  const [participants] = useAtom(participantsAtom);
  return (
    <>
      <Heading4>참여자</Heading4>
      <Flex direction="vertical" gap="10">
        {participants.map((participant) => (
          <ParticipantItem key={participant.nickname} {...participant} />
        ))}
      </Flex>
    </>
  );
};
