import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { VoidFunctionComponent } from "react";

const theme = extendTheme({
  colors: {
    primary: {
      100: "hsl(40 100% 66% / 100%)",
      66: "hsl(40 100% 66% / 66%)",
      33: "hsl(40 100% 66% / 33%)",
      10: "hsl(40 100% 66% / 10%)",
      8: "hsl(40 100% 66% / 8%)",
      0: "hsl(40 100% 66% / 0%)",
    },
    dangerous: {
      100: "hsl(0 68% 42% / 100%)",
      66: "hsl(0 68% 42% / 66%)",
      33: "hsl(0 68% 42% / 33%)",
      10: "hsl(0 68% 42% / 10%)",
      8: "hsl(0 68% 42% / 8%)",
      0: "hsl(0 68% 42% / 0%)",
    },
    text: {
      100: "hsl(0 0% 100% / 100%)",
      66: "hsl(0 0% 100% / 66%)",
      33: "hsl(0 0% 100% / 33%)",
      10: "hsl(0 0% 100% / 10%)",
      8: "hsl(0 0% 100% / 8%)",
      0: "hsl(0 0% 100% / 0%)",
    },
    elevation: {
      0: "hsl(210 10% 12% / 100%)",
      1: "hsl(210 11% 15% / 100%)",
      2: "hsl(210 9% 17% / 100%)",
    },
  },
  fonts: {
    sans: "Noto Sans KR, sans-serif",
  },
  fontSizes: {
    heading1: "40px",
    heading2: "32px",
    heading3: "24px",
    heading4: "20px",
    heading5: "16px",
    label: "16px",
    paragraph: "16px",
  },
  fontWeights: {
    bold: 700,
    medium: 500,
  },
  lineHeights: {
    heading: "150%",
    label: "120%",
    paragraph: "150%",
  },
  shadows: {
    raised: "0px 2px 1px rgba(0, 0, 0, 0.1)",
    overlay: "0px 4px 8px rgba(0, 0, 0, 0.1",
    popOut: "0px 12px 24px rgba(0, 0, 0, 0.1)",
  },
});

const Page: VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};
export default Page;
