import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages } from "../http/get-room-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMessagesWebsockets } from "../hooks/use-messages-websockets";

export function Messages() {
  const { roomId } = useParams();

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  useMessagesWebsockets({ roomId });

  const { data } = useSuspenseQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getRoomMessages({ roomId }),
  });

  const sortedMessages = data.messages
    .sort((a, b) => {
      return b.amountOfReactions - a.amountOfReactions;
    })
    .sort((a, b) => {
      if (a.answered && !b.answered) {
        return 1;
      }

      if (!a.answered && b.answered) {
        return -1;
      }

      return 0;
    });

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {sortedMessages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          text={message.text}
          amountOfReactions={message.amountOfReactions}
          answered={message.answered}
        />
      ))}
    </ol>
  );
}
