import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <body className="pattern-cross-dots-sm">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
