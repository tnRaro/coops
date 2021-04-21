import { Container, Heading, Text } from "@chakra-ui/layout";
import { VoidFunctionComponent } from "react";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  return (
    <Container>
      <Heading>Work in Progress</Heading>
      <Text>index.tsx</Text>
    </Container>
  );
};
export default Page;
