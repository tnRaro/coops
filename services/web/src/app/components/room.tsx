import { Box, Container, Heading, Text } from "@chakra-ui/layout";
import { Input, Button, Flex, useClipboard } from "@chakra-ui/react";
import { useState, VoidFunctionComponent } from "react";

function getRoomId() {
  const roomUrl = window.location.href;
  const roomIdArr = roomUrl.split("/");
  const num = roomIdArr.length;
  const roomId = roomIdArr[num - 1];

  return roomId;
}

type RoomProps = unknown;
const Room: VoidFunctionComponent<RoomProps> = (props) => {
  const roomId = getRoomId();
  const [value, setValue] = useState(roomId);
  const { hasCopied, onCopy } = useClipboard(value);
  return (
    <Flex height="100%" flexDirection="column">
      {/* Header, COOPS Logo Section */}
      <Flex flex="1" flexDirection="row" alignItems="center">
        <Text paddingLeft="10" color="text.100">
          COOPS LOGO HERE
        </Text>
      </Flex>
      {/* Body, Main Content Section */}
      <Flex flex="9" flexDirection="row">
        <Flex flex="2.5" margin="5" marginLeft="10" flexDirection="column">
          <Flex flex="1.5" padding="4" layerStyle="card" flexDirection="column">
            <Text>초대 코드</Text>
            <Flex marginTop="5" alignItems="center" flexDirection="row">
              <Input
                flex="8"
                variant="unstyled"
                borderRadius="8px"
                backgroundColor="elevation.2"
                textStyle="label1"
                textColor="text.100"
                padding="4"
                paddingLeft="5"
                value={value}
              />
              <Button
                flex="2"
                backgroundColor="primary.10"
                borderRadius="8px"
                padding="7"
                marginLeft="5"
                color="primary.100"
                textStyle="label1Bold"
                _hover={{ backgroundColor: "text.33" }}
                onClick={onCopy}
              >
                {hasCopied ? "완  료" : "복사하기"}
              </Button>
            </Flex>
          </Flex>
          <Flex flex="0.25" />
          <Flex
            flex="2.75"
            padding="4"
            marginBottom="5"
            layerStyle="elevation1"
          >
            참여자 ({}/{})
          </Flex>
          <Flex flex="4" padding="4" layerStyle="elevation1">
            설정
          </Flex>
          <Flex flex="1.5" />
        </Flex>
        <Flex flex="7.5" margin="5" flexDirection="column">
          <Flex flex="1.5" padding="4" layerStyle="card">
            공지사항
          </Flex>
          <Flex flex="0.3" />
          <Flex
            flex="8.2"
            padding="4"
            layerStyle="elevation1"
            flexDirection="column"
          >
            <Flex flex="9">SampleText</Flex>
            <Flex flex="1">
              <Input
                placeholder="메시지 보내기"
                _placeholder={{ color: "text.33" }}
                variant="unstyled"
                borderRadius="8px"
                backgroundColor="elevation.2"
                textStyle="label1"
                textColor="text.100"
                padding="4"
                paddingLeft="5"
                marginBottom="2.5"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
