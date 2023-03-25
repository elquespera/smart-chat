import Head from "next/head";
import Main from "components/Main";

export default function Home() {
  return (
    <>
      <Head>
        <title>SmartChat</title>
        <meta name="description" content="Chat with open AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Main />
    </>
  );
}
