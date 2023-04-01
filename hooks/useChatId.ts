import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useChatId() {
  const [chatId, setChatId] = useState<string>();
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    setChatId(Array.isArray(slug) ? slug[0] : slug);
  }, [slug]);

  return chatId;
}
