/* eslint-disable no-console */
import { Container, Heading } from "@chakra-ui/react";
import { useEffect, VoidFunctionComponent } from "react";

import { useStream } from "../app/hooks/useStream";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  const stream = useStream("R6D2YU", "24fb5d17-c136-43d5-8273-735d1676f680");
  useEffect(() => {
    stream.on("chat", (data) => console.log(data));
    stream.on("room", (data) => console.log(data));
    stream.on("participant", (data) => console.log(data));
  }, [stream]);
  return (
    <Container>
      <Heading>Work in Progress</Heading>
    </Container>
  );
};
export default Page;
