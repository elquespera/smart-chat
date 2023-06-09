import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AppContext, useAppContext } from "context/AppContext";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const appContext = useAppContext();

  return (
    <>
      <Head>
        <title>SmartChat</title>
        <meta name="description" content="Chat with open AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ClerkProvider
        {...pageProps}
        appearance={{
          baseTheme: appContext.theme === "dark" ? dark : undefined,
        }}
      >
        <AppContext.Provider value={appContext}>
          <Component {...pageProps} />
        </AppContext.Provider>
      </ClerkProvider>
    </>
  );
}
