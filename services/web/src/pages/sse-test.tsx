/* eslint-disable no-console */
import { Container, Heading } from "@chakra-ui/react";
import { useEffect, VoidFunctionComponent } from "react";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:5353/api/rooms/535353/stream?key=53",
      {
        withCredentials: true,
      },
    );
    eventSource.onmessage = (event) => {
      console.log(event.type, event.data);
    };
    eventSource.addEventListener("li dailin", (event) => {
      console.log("li dailin", event);
    });
    eventSource.onerror = (error) => {
      console.error(error);
      eventSource.close();
    };
  }, []);
  return (
    <Container>
      <Heading>Work in Progress</Heading>
    </Container>
  );
};
export default Page;
