import { Container, Heading } from "@chakra-ui/react";
import { VoidFunctionComponent } from "react";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  return (
    <Container>
      <Heading>Work in Progress</Heading>
    </Container>
  );
};
export default Page;
