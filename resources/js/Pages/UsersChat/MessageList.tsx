import React from 'react';

interface IMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  isSender?: boolean;
}

interface MessageListProps {
    messages: IMessage[];
    endRef: React.RefObject<HTMLLIElement>; // Add this line
  }

  const MessageList: React.FC<MessageListProps> = ({ messages, endRef }) => {
    return (
      <ul className='space-y-2'>
  {messages.map((message, index) => (
    <li key={index} className={`text-sm ${message.isSender ? "text-right" : "text-left"}`} ref={index === messages.length - 1 ? endRef : null}>
      <div className={`inline-block max-w-2/3 px-4 py-2 rounded-xl m-4 ${message.isSender ? "bg-green-200" : "bg-white"}`}>
        {message.message}
      </div>
    </li>
  ))}
</ul>

    );
  };

export default MessageList;
