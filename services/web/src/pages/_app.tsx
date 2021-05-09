import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { VoidFunctionComponent } from "react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
        backgroundColor: "elevation.0",
      },
    },
  },
  layerStyles: {
    card: {
      background:
        "radial-gradient(71.72% 56.77% at 0% 0%, rgba(255, 196, 82, 0.1) 0%, rgba(255, 196, 82, 0) 100%), #212529",
      boxShadow: "overlay",
      borderRadius: "20px",
    },
    popOut: {
      backgroundColor: "rgba(39, 43, 47, 0.66)",
      boxShadow: "popOut",
    },
  },
  textStyles: {
    heading1: {
      fontSize: "heading1",
      fontWeight: "bold",
      lineHeight: "heading",
    },
    heading2: {
      fontSize: "heading2",
      fontWeight: "bold",
      lineHeight: "heading",
    },
    heading3: {
      fontSize: "heading3",
      fontWeight: "bold",
      lineHeight: "heading",
    },
    heading4: {
      fontSize: "heading4",
      fontWeight: "bold",
      lineHeight: "heading",
    },
    heading5: {
      fontSize: "heading5",
      fontWeight: "bold",
      lineHeight: "heading",
    },
    label1: {
      fontSize: "label",
      fontWeight: "medium",
      lineHeight: "label",
    },
    label1Bold: {
      fontSize: "label",
      fontWeight: "bold",
      lineHeight: "label",
    },
    paragraph1: {
      fontSize: "paragraph",
      fontWeight: "meduim",
      lineHeight: "paragraph",
    },
  },
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
    heading: "var(--chakra-fonts-sans)",
    body: "var(--chakra-fonts-sans)",
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
    overlay: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
