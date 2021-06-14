import React from "react";

import * as chats from "../queries/chats";
import * as participants from "../queries/participants";
import * as rooms from "../queries/rooms";
import * as errorHandlers from "../queries/errorHanders";

import { useOops } from "./useOops";

export const useQuery = () => {
  const setOops = useOops();

  const pushChat = React.useCallback<typeof chats.pushChat>(
    async (roomId, authorId, message) => {
      try {
        return await chats.pushChat(roomId, authorId, message);
      } catch (error) {
        setOops(errorHandlers.pushChat(error));
        throw error;
      }
    },
    [setOops],
  );
  const getAllChats = React.useCallback<typeof chats.getAllChats>(
    async (roomId, authorId) => {
      try {
        return await chats.getAllChats(roomId, authorId);
      } catch (error) {
        setOops(errorHandlers.getAllChats(error));
        throw error;
      }
    },
    [setOops],
  );
  const createParticipant = React.useCallback<
    typeof participants.createParticipant
  >(
    async (roomId, nickname) => {
      try {
        return await participants.createParticipant(roomId, nickname);
      } catch (error) {
        setOops(errorHandlers.createParticipant(error));
        throw error;
      }
    },
    [setOops],
  );
  const kickParticipant = React.useCallback<
    typeof participants.kickParticipant
  >(
    async (roomId, nickname, authorId) => {
      try {
        return await participants.kickParticipant(roomId, nickname, authorId);
      } catch (error) {
        setOops(errorHandlers.kickParticipant(error));
        throw error;
      }
    },
    [setOops],
  );
  const entrustHost = React.useCallback<typeof participants.entrustHost>(
    async (roomId, nickname, authorId) => {
      try {
        return await participants.entrustHost(roomId, nickname, authorId);
      } catch (error) {
        setOops(errorHandlers.entrustHost(error));
        throw error;
      }
    },
    [setOops],
  );
  const unmuteMicrophone = React.useCallback<
    typeof participants.unmuteMicrophone
  >(
    async (roomId, nickname, authorId) => {
      try {
        return await participants.unmuteMicrophone(roomId, nickname, authorId);
      } catch (error) {
        setOops(errorHandlers.updateParticipant(error));
        throw error;
      }
    },
    [setOops],
  );
  const muteMicrophone = React.useCallback<typeof participants.muteMicrophone>(
    async (roomId, nickname, authorId) => {
      try {
        return await participants.muteMicrophone(roomId, nickname, authorId);
      } catch (error) {
        setOops(errorHandlers.updateParticipant(error));
        throw error;
      }
    },
    [setOops],
  );
  const unmuteSpeaker = React.useCallback<typeof participants.unmuteSpeaker>(
    async (roomId, nickname, authorId) => {
      try {
        return await participants.unmuteSpeaker(roomId, nickname, authorId);
      } catch (error) {
        setOops(errorHandlers.updateParticipant(error));
        throw error;
      }
    },
    [setOops],
  );
  const muteSpeaker = React.useCallback<typeof participants.muteSpeaker>(
    async (roomId, nickname, authorId) => {
      try {
        return await participants.muteSpeaker(roomId, nickname, authorId);
      } catch (error) {
        setOops(errorHandlers.updateParticipant(error));
        throw error;
      }
    },
    [setOops],
  );
  const createRoom = React.useCallback<typeof rooms.createRoom>(
    async (title) => {
      try {
        return await rooms.createRoom(title);
      } catch (error) {
        setOops(errorHandlers.createRoom(error));
        throw error;
      }
    },
    [setOops],
  );
  const getRoom = React.useCallback<typeof rooms.getRoom>(
    async (roomId, authorId) => {
      try {
        return await rooms.getRoom(roomId, authorId);
      } catch (error) {
        setOops(errorHandlers.getRoom(error));
        throw error;
      }
    },
    [setOops],
  );
  const resetRoom = React.useCallback<typeof rooms.resetRoom>(
    async (roomId, authorId) => {
      try {
        return await rooms.resetRoom(roomId, authorId);
      } catch (error) {
        setOops(errorHandlers.resetRoom(error));
        throw error;
      }
    },
    [setOops],
  );
  const clearRoom = React.useCallback<typeof rooms.clearRoom>(
    async (roomId, authorId) => {
      try {
        return await rooms.clearRoom(roomId, authorId);
      } catch (error) {
        setOops(errorHandlers.clearRoom(error));
        throw error;
      }
    },
    [setOops],
  );
  const updateRoomSettings = React.useCallback<typeof rooms.updateRoomSettings>(
    async (roomId, authorId, settings) => {
      try {
        return await rooms.updateRoomSettings(roomId, authorId, settings);
      } catch (error) {
        setOops(errorHandlers.updateRoomSettings(error));
        throw error;
      }
    },
    [setOops],
  );

  return {
    pushChat,
    getAllChats,
    createParticipant,
    kickParticipant,
    entrustHost,
    unmuteMicrophone,
    muteMicrophone,
    unmuteSpeaker,
    muteSpeaker,
    createRoom,
    getRoom,
    resetRoom,
    clearRoom,
    updateRoomSettings,
  };
};
