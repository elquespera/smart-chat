import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AppContext, useAppContext } from "context/AppContext";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const appContext = useAppContext();

  return (
    <AppContext.Provider value={appContext}>
      <ClerkProvider
        {...pageProps}
        appearance={{
          baseTheme: appContext.theme === "dark" ? dark : undefined,
        }}
      >
        <Component {...pageProps} />
      </ClerkProvider>
    </AppContext.Provider>
  );
}
