import { initialMessages } from "./ai.mock";

export async function getConversation() {
  await new Promise((resolve) =>
    setTimeout(resolve, 300),
  );

  return initialMessages;
}