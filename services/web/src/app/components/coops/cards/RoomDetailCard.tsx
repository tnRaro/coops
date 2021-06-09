import { useAtomValue } from "jotai/utils";
import React, { useEffect, useRef, useState } from "react";

import {
  authorIdAtom,
  isHostAtom,
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
  const isHost = useAtomValue(isHostAtom);
  const title = useAtomValue(roomTitleAtom);
  const description = useAtomValue(roomDescriptionAtom);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const hasDescription = description != null;
  const descriptionColor = hasDescription ? "text66" : "text33";
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isTitleEditing) {
      setEditingTitle(title ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTitleEditing]);
  useEffect(() => {
    if (isDescriptionEditing) {
      setEditingTitle(description ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDescriptionEditing]);
  useEffect(() => {
    inputRef.current?.focus();
  }, [isDescriptionEditing, isTitleEditing]);
  if (roomId == null) return null;
  if (authorId == null) return null;
  return (
    <>
      {isTitleEditing ? (
        <Input
          ref={inputRef}
          css={{
            padding: 0,
            fontSize: "$heading4",
            fontWeight: "$heading",
            lineHeight: "$heading",
          }}
          placeholder="방 제목을 입력해주세요"
          value={editingTitle ?? ""}
          onChange={(event) => setEditingTitle(event.target.value)}
          onKeyPress={async (event) => {
            if (event.key === "Enter") {
              try {
                await queries.updateRoomSettings(roomId, authorId, {
                  title: editingTitle ?? undefined,
                });
                setIsTitleEditing(false);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsTitleEditing(false);
            }
          }}
          onBlur={() => {
            if (editingTitle === "" || editingTitle === (title ?? "")) {
              setIsTitleEditing(false);
            }
          }}
        />
      ) : (
        <Heading4
          onClick={() => {
            if (isHost) {
              setIsTitleEditing(true);
            }
          }}
        >
          {title}
        </Heading4>
      )}
      {isDescriptionEditing ? (
        <Input
          ref={inputRef}
          css={{
            padding: 0,
          }}
          placeholder="공지사항을 입력해주세요"
          value={editingDescription ?? ""}
          onChange={(event) => setEditingDescription(event.target.value)}
          onKeyPress={async (event) => {
            if (event.key === "Enter") {
              try {
                await queries.updateRoomSettings(roomId, authorId, {
                  description: editingDescription ?? undefined,
                });
                setIsDescriptionEditing(false);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            } else if (event.key === "Escape") {
              setIsDescriptionEditing(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsTitleEditing(false);
            }
          }}
          onBlur={() => {
            if (
              editingDescription === "" ||
              editingDescription === (description ?? "")
            ) {
              setIsDescriptionEditing(false);
            }
          }}
        />
      ) : (
        <Text
          color={descriptionColor}
          onClick={() => {
            if (isHost) {
              setIsDescriptionEditing(true);
            }
          }}
        >
          {description ?? "공지사항을 입력해주세요"}
        </Text>
      )}
    </>
  );
};
