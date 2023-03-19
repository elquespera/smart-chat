import Head from "next/head";
import Header from "components/Header";
import Chat from "components/Chat";
import Input from "components/Input";

export default function Home() {
  return (
    <>
      <Head>
        <title>SmartChat</title>
        <meta name="description" content="Chat with open AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <main className="h-[100dvh] pt-header flex flex-col">
        <Chat />
        <Input />
      </main>
    </>
  );
}
