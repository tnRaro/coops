/* eslint-disable no-console */
import { Container, Heading } from "@chakra-ui/react";
import { useEffect, VoidFunctionComponent } from "react";

import { useStream } from "../app/hooks/useStream";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  const stream = useStream("6XKFUS", "5158b897-5be4-43f4-83dd-684c2d5340d5");
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
