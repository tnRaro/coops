import Document, { Html, Head, Main, NextScript } from "next/document";

import { getCssString } from "../app/stitches.config";

class MyDocument extends Document {
  render() {
    const styles = getCssString();
    return (
      <Html lang="ko">
        <Head>
          <style id="stitches" dangerouslySetInnerHTML={{ __html: styles }} />
        </Head>
        <body>
          <script>0</script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
