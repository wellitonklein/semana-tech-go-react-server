import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { createMessageReaction } from "../http/create-message-reaction";
import { removeMessageReaction } from "../http/remove-message-reaction";

interface MessageProps {
  id: string;
  text: string;
  amountOfReactions: number;
  answered?: boolean;
}

export function Message({
  id: messageId,
  text,
  amountOfReactions,
  answered = false,
}: MessageProps) {
  const { roomId } = useParams();
  const [hasReacted, setHasReacted] = useState(false);

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  async function createMessageReactionAction() {
    if (!roomId) return;

    try {
      await createMessageReaction({
        roomId,
        messageId,
      });
      setHasReacted(true);
    } catch {
      toast.error("Erro ao curtir a pergunta");
    }
  }

  async function removeMessageReactionAction() {
    if (!roomId) return;

    try {
      await removeMessageReaction({
        roomId,
        messageId,
      });
      setHasReacted(false);
    } catch {
      toast.error("Erro ao remover a reação da pergunta");
    }
  }

  return (
    <li
      data-answered={answered}
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}
      {hasReacted ? (
        <button
          onClick={removeMessageReactionAction}
          type="button"
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-300"
        >
          <ArrowUp className="size-4" /> Curtir pergunta ({amountOfReactions})
        </button>
      ) : (
        <button
          onClick={createMessageReactionAction}
          type="button"
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" /> Curtir pergunta ({amountOfReactions})
        </button>
      )}
    </li>
  );
}
