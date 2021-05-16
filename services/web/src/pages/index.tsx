import { Box, Container, Heading, Text } from "@chakra-ui/layout";
import { Input, Button, Flex, Spacer, Center } from "@chakra-ui/react";
import { VoidFunctionComponent } from "react";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  return (
    <Flex height="100%" justifyContent="center" alignItems="center">
      <Flex flexDirection="column" padding="14" layerStyle="card">
        <Text color="text.100" textStyle="heading1" marginBottom="14">
          저에게 집결하세요!
        </Text>
        <Input
          placeholder="초대 코드를 입력해주세요"
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
        <Button
          backgroundColor="text.10"
          borderRadius="8px"
          width="100%"
          padding="7"
          color="text.66"
          textStyle="label1Bold"
          marginBottom="5"
          _hover={{ backgroundColor: "text.33" }}
        >
          방 참가하기
        </Button>
        <Flex display="flex" alignItems="center">
          <Box flex="1" height="1px" background="text.33" />
          <Box flex="0.5">
            <Center>
              <Text color="text.33" textStyle="label1">
                또는
              </Text>
            </Center>
          </Box>
          <Box flex="1" height="1px" background="text.33" />
        </Flex>
        <Input
          placeholder="방 제목을 입력해주세요"
          _placeholder={{ color: "text.33" }}
          variant="unstyled"
          borderRadius="8px"
          backgroundColor="elevation.2"
          textStyle="label1"
          textColor="text.100"
          padding="4"
          paddingLeft="5"
          marginTop="5"
          marginBottom="2.5"
        />
        <Button
          backgroundColor="primary.10"
          borderRadius="8px"
          width="100%"
          padding="7"
          color="primary.100"
          textStyle="label1Bold"
          _hover={{ backgroundColor: "text.33" }}
        >
          방 만들기
        </Button>
      </Flex>
    </Flex>
  );
};
export default Page;
