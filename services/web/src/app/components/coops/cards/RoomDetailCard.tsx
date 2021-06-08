/* eslint-disable @shopify/jsx-no-complex-expressions */
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import React, { useEffect, useRef, useState } from "react";

import {
  authorIdAtom,
  participantsAtom,
  roomDescriptionAtom,
  roomIdAtom,
  roomTitleAtom,
} from "../../../atoms";
import { useQuery } from "../../../hooks/useQuery";
import { Heading4 } from "../../primitives/Heading";
import { Input } from "../../primitives/Input";
import { Text } from "../../primitives/Text";

interface RoomDetailCardProps {}
export const RoomDetailCard: React.VFC<RoomDetailCardProps> = () => {
  const queries = useQuery();
  const roomId = useAtomValue(roomIdAtom);
  const authorId = useAtomValue(authorIdAtom);
  const participants = useAtomValue(participantsAtom);
  const [title, setTitle] = useAtom(roomTitleAtom);
  const [description, setDescription] = useAtom(roomDescriptionAtom);
  const hasDescription = description != null;
  const descriptionColor = hasDescription ? "text66" : "text33";
  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const [isDescriptionEdit, setIsDescriptionEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [isDescriptionEdit, isTitleEdit]);
  if (roomId == null) return null;
  if (authorId == null) return null;
  return (
    <>
      {isTitleEdit ? (
        <Input
          ref={inputRef}
          onClick={() => {
            setIsTitleEdit(true);
          }}
          css={{
            padding: 0,
            fontSize: "$heading4",
            fontWeight: "$heading",
            lineHeight: "$heading",
          }}
          placeholder="방 제목을 입력해주세요"
          value={title ?? ""}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              try {
                await queries.updateRoomSettings(roomId, authorId, {
                  title: title ?? undefined,
                });
                setIsTitleEdit(false);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }
          }}
          onBlur={() => {
            if (title === "") {
              setIsTitleEdit(false);
            }
          }}
        />
      ) : (
        <Heading4 onClick={() => setIsTitleEdit(true)}>{title}</Heading4>
      )}
      {isDescriptionEdit ? (
        <Input
          ref={inputRef}
          onClick={() => {
            setIsDescriptionEdit(true);
          }}
          css={{
            padding: 0,
          }}
          placeholder="공지사항을 입력해주세요"
          value={description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              try {
                await queries.updateRoomSettings(roomId, authorId, {
                  description: description ?? undefined,
                });
                setIsDescriptionEdit(false);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }
          }}
          onBlur={() => {
            if (description === "") {
              setIsDescriptionEdit(false);
            }
          }}
        />
      ) : (
        <Text
          color={descriptionColor}
          onClick={() => setIsDescriptionEdit(true)}
        >
          {description ?? "공지사항을 입력해주세요"}
        </Text>
      )}
    </>
  );
};
