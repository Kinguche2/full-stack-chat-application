import { useAuthContext } from "../../context/AuthContext";
import { messages } from "../../Dto/messages";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }: { message: messages }) => {
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const formattedTime = extractTime(message?.createdAt);
  const fromMe = message?.senderId === authUser?.signInUser?.userId;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const shakeClass = message.shouldShake ? "shake" : "";
  const profilePic = fromMe
    ? authUser?.signInUser?.profileImage
    : selectedConversation?.profileImage;

  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  return (
    <>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img alt="Tailwind CSS chat bubble component" src={profilePic} />
          </div>
        </div>
        <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
          {message.message}
        </div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
          {formattedTime}
        </div>
      </div>
    </>
  );
};

export default Message;
