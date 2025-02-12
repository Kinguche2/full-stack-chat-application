import { useSocketContext } from "../../context/SocketContext";
import ConversationModel from "../../Dto/conversation";
import useConversation from "../../zustand/useConversation";

const Conversation: React.FC<{
  conversation: ConversationModel;
  emoji: any;
  lastIdx: any;
}> = ({ conversation, emoji, lastIdx }) => {
  const { selectedConversation, setCurrentConversation } = useConversation();

  const isSelected =
    selectedConversation?._id?.toString() === conversation._id.toString();

  const { onlineUser } = useSocketContext();
  const isOnline = onlineUser.includes(conversation._id.toString());
  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-500" : ""}
			`}
        onClick={() => setCurrentConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.profileImage} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{`${conversation.firstName} ${conversation.lastName}`}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
