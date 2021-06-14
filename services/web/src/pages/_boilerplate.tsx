import React, { VoidFunctionComponent } from "react";

import { Container } from "../app/components/core/Container";
import { Heading1 } from "../app/components/primitives/Heading";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  return (
    <Container>
      <Heading1>Work in Progress</Heading1>
    </Container>
  );
};
export default Page;
