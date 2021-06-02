import { Box } from "@chakra-ui/layout";
import { chakra, ChakraComponent } from "@chakra-ui/system";
import { ReactNode, VoidFunctionComponent } from "react";

interface OptionProps {
  children: ReactNode;
}
chakra("option");
export const Option: ChakraComponent<"option", OptionProps> = (props) => {
  const { sx, children, ...rest } = props;
  return (
    <Box
      as="option"
      sx={{
        ...sx,
      }}
      style={{ background: "var(--chakra-colors-elevation-2)" }}
      {...rest}
    >
      {children}
    </Box>
  );
};
