import { useSocketContext } from "../../context/SocketContext";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

/* const Conversations = () => {
  const { conversations, loading } = useGetConversations();
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id.toString()}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};

export default Conversations; */

const Conversations = () => {
  const { conversations, loading } = useGetConversations();
  const { onlineUser } = useSocketContext();

  // Sort conversations by online status
  const sortedConversations = conversations.sort((a, b) => {
    const isAOnline = onlineUser.includes(a._id.toString());
    const isBOnline = onlineUser.includes(b._id.toString());
    return Number(isBOnline) - Number(isAOnline);  // `true - false` will put online users first
  });

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {sortedConversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id.toString()}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === sortedConversations.length - 1}
        />
      ))}
      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};

export default Conversations;
