import { IdProvider } from "@radix-ui/react-id";
import { Provider } from "jotai";
import type { AppProps } from "next/app";
import { VoidFunctionComponent } from "react";

import { OopsBoundary } from "../app/components/coops/OopsBoundary";
import { ToastBoundary } from "../app/components/coops/ToastBoundary";
import "../app/styles/fonts.css";
import "../app/styles/global.css";

const Page: VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <IdProvider>
      <Provider>
        <ToastBoundary>
          <OopsBoundary>
            <Component {...pageProps} />
          </OopsBoundary>
        </ToastBoundary>
      </Provider>
    </IdProvider>
  );
};
export default Page;
