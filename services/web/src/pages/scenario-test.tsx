/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable no-console */
import { Code, Container, Heading, Text } from "@chakra-ui/layout";
import { useEffect, VoidFunctionComponent } from "react";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  useEffect(() => {
    setTimeout(async () => {
      console.clear();
      const history = [];
      interface State {
        [index: string]: unknown;
      }
      const state: State = {};
      interface Scena {
        url: string | (() => string);
        description: string;
        body?: BodyInit;
        method?: string;
        headers?: HeadersInit | (() => HeadersInit);
        cb?: (data: any) => Promise<unknown>;
        eh?: (res: Response) => Promise<unknown>;
      }
      const scenario: Scena[] = [
        {
          url: "/api/room/title/가나다라마바사",
          description:
            "`가나다라마바사`라는 이름의 방을 생성합니다. roomId를 응답받습니다.",
          method: "POST",
          cb: async (data) => {
            state.roomId = data.roomId;
          },
        },
        {
          url: () => `/api/rooms/${state.roomId}`,
          description: "최초 1회 방 정보를 가져옵니다.",
        },
        {
          url: () => `/api/rooms/${state.roomId}/participants/탱템버린`,
          description:
            "`탱템버린`이라는 이름의 참가자로 참가 요청을 보냅니다. 최초 접속자이므로, 호스트가 됩니다.",
          method: "POST",
          cb: async (data) => {
            state.hostId = data.participantId;
          },
        },
        {
          url: () => `/api/rooms/${state.roomId}/participants/탱템버린`,
          description:
            "같은 방에 닉네임이 중복되는 닉네임이 있으므로 생성되지 않습니다.",
          method: "POST",
          cb: async (data) => {
            throw data;
          },
          eh: async (res) => {
            if (res instanceof Response) {
              if (res.status !== 409) {
                throw res;
              }
            } else {
              throw res;
            }
          },
        },
        {
          url: () => `/api/rooms/${state.roomId}/participants/폐지줍는끼런이`,
          description: "폐지줍는끼런이가 방에 입장합니다.",
          method: "POST",
          cb: async (data) => {
            state.p1 = data.participantId;
          },
        },
        {
          url: () => `/api/rooms/${state.roomId}`,
          description:
            "전달받은 API KEY로, 방 정보를 다시 가져옵니다. 참가자 목록과 채팅 기록을 볼 수 있습니다.",
          method: "GET",
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
          cb: async (data) => {
            state.roomId = data.roomId;
          },
        },
        {
          url: () => `/api/rooms/${state.roomId}/participants/탱템버린`,
          description: "폐지줍는끼런이가 탱템버린을 강퇴합니다.",
          method: "DELETE",
          headers: () => ({ authorization: `X-API-KEY ${state.p1}` }),
          cb: async (data) => {
            console.log(data);
          },
          eh: async (res) => {
            if (res instanceof Response) {
              if (res.status !== 403) {
                throw res;
              }
            } else {
              throw res;
            }
          },
        },
        // {
        //   url: () => `/api/rooms/${state.roomId}/participants/폐지줍는끼런이`,
        //   description: "폐지줍는끼런이를 탱템버린이 강퇴합니다.",
        //   method: "DELETE",
        //   headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
        //   cb: async (data) => {
        //     console.log(data);
        //   },
        // },
        {
          url: () => `/api/rooms/${state.roomId}`,
          description:
            "전달받은 API KEY로, 방 정보를 다시 가져옵니다. 참가자 목록과 채팅 기록을 볼 수 있습니다.",
          method: "GET",
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
        },
        {
          url: () => `/api/rooms/${state.roomId}/host/폐지줍는끼런이`,
          description: "방장을 폐지줍는끼런이에게 전달합니다",
          method: "PUT",
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
          cb: async (data) => {
            const hostId = state.hostId;
            state.hostId = state.p1;
            state.p1 = hostId;
          },
        },
        {
          url: () => `/api/rooms/${state.roomId}`,
          description:
            "전달받은 API KEY로, 방 정보를 다시 가져옵니다. 참가자 목록과 채팅 기록을 볼 수 있습니다.",
          method: "GET",
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
        },
        {
          url: () =>
            `/api/rooms/${state.roomId}/participants/폐지줍는끼런이/microphone`,
          description: "폐지줍는끼런이가 자신의 마이크를 음소거합니다.",
          method: "DELETE",
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
        },
        {
          url: () =>
            `/api/rooms/${state.roomId}/participants/탱템버린/microphone`,
          description: "폐지줍는끼런이가 탱템버린의 마이크를 음소거합니다.",
          method: "DELETE",
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
        },
        {
          url: () => `/api/rooms/${state.roomId}/settings`,
          description: "방 정보를 변경합니다.",
          method: "PUT",
          body: JSON.stringify({
            title: "딥스톤 무덤 초행팟",
            description:
              "초행 가이드, 참새런 노글리치 업적, 1넴 챌린지, 2넴 챌린지, 3넴 챌린지, 막넴 4핵심 진행. 리트 머리 깨질 각오 필요.",
            maximumParticipants: 0,
          }),
          headers: () => ({ authorization: `X-API-KEY ${state.hostId}` }),
        },
        {
          url: () => `/api/rooms/${state.roomId}`,
          description:
            "전달받은 API KEY로, 방 정보를 다시 가져옵니다. 참가자 목록과 채팅 기록을 볼 수 있습니다.",
          method: "GET",
          headers: () => ({
            authorization: `X-API-KEY ${state.hostId}`,
            "content-type": "application/json",
          }),
        },
      ];
      try {
        for (const scena of scenario) {
          try {
            const url =
              typeof scena.url === "function" ? scena.url() : scena.url;
            const method = scena.method ?? "GET";
            const headers =
              typeof scena.headers === "function"
                ? scena.headers()
                : scena.headers ?? {};
            const body = scena.body;
            const res = await fetch(url, { method, headers, body });
            console.group(scena.description);
            console.info(method, url);
            if (res.status >= 400) {
              throw res;
            }
            let data = null;
            if (res.status !== 204) {
              data = await res.json();
            }
            console.log(res.status, data);
            console.groupEnd();
            history.push(data);
            if (typeof scena.cb === "function") await scena.cb(data);
          } catch (error) {
            if (typeof scena.eh === "function") {
              await scena.eh(error);
              if (error instanceof Response) {
                console.log(error.status, await error.text());
              }
              console.groupEnd();
            } else throw error;
          }
        }
      } catch (error) {
        console.error(error);
        console.groupEnd();
      }
      console.info("result");
      console.log("history", history);
      console.log("state", state);
    });
  }, []);
  return (
    <Container>
      <Heading>Work in Progress</Heading>
      <Text>
        {"Press "}
        <Code>Ctrl + Shift + I</Code>
        {" or "}
        <Code>F12</Code>
        {" to open devtools"}
      </Text>
    </Container>
  );
};
export default Page;
