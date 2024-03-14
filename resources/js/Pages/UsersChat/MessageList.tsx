import React from 'react';

interface IMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  isSender?: boolean;
  createdAt?: any;
}

interface MessageListProps {
    messages: IMessage[];
    endRef: React.RefObject<HTMLLIElement>; // Add this line
    handleDeleteMessage: (messageId: number) => Promise<void>;

  }

  const MessageList: React.FC<MessageListProps> = ({ messages, endRef, handleDeleteMessage }) => {
    return (
      <ul className='space-y-2'>
  {messages.map((message, index) => (
    <li key={index} className={`text-sm ${message.isSender ? "text-right" : "text-left"}`} ref={index === messages.length - 1 ? endRef : null}>
      <div className={`inline-block max-w-2/3 px-4 py-2 rounded-xl mx-4 my-2 ${message.isSender ? "bg-green-200" : "bg-white"}`}>
      

        {message.message}
        <button onClick={() => handleDeleteMessage(message.id)} className="ml-2 text-red-500">Delete</button>

      </div>
        <div className="message-time text-[11px] dark:text-slate-100 text-slate-00 mx-5">{message.createdAt}</div>
    </li>
  ))}
</ul>

    );
  };

export default MessageList;
