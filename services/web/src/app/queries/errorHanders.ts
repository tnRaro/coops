import { HttpError } from "@coops/error";

import { FrontError } from "../errors";

type ErrorHandler = (error: Error) => Error;

const sharedMessages = {
  400: "잘못된 접근입니다",
  401: "참여자가 없습니다",
  403: "권한이 없습니다",
  404: "방이 존재하지 않습니다",
  409: "잠시 후에 다시 시도해보세요",
} as { [index in HttpError["code"]]: string };

export const pushChat: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 404:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
export const getAllChats: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 404:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
export const createParticipant: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 404:
      case 409:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
export const kickParticipant: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 403:
        return new FrontError(sharedMessages[error.code]);
      case 404:
        return new FrontError("참여자가 존재하지 않습니다");
    }
  }
  return error;
};
export const entrustHost: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 403:
        return new FrontError(sharedMessages[error.code]);
      case 404:
        return new FrontError("참여자가 존재하지 않습니다");
    }
  }
  return error;
};
export const updateParticipant: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 403:
        return new FrontError(sharedMessages[error.code]);
      case 404:
        return new FrontError("참여자가 존재하지 않습니다");
    }
  }
  return error;
};
export const createRoom: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
export const getRoom: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 404:
      case 409:
        return new FrontError(sharedMessages[error.code], { pageError: true });
    }
  }
  return error;
};
export const resetRoom: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 403:
      case 404:
      case 409:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
export const clearRoom: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 403:
      case 404:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
export const updateRoomSettings: ErrorHandler = (error) => {
  if (error instanceof HttpError) {
    switch (error.code) {
      case 400:
      case 401:
      case 403:
      case 404:
        return new FrontError(sharedMessages[error.code]);
    }
  }
  return error;
};
