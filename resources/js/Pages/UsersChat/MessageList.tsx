import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

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
  endRef: React.RefObject<HTMLLIElement>;
  handleDeleteMessage: (messageId: number) => Promise<void>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, endRef, handleDeleteMessage }) => {
  return (
    <ul className="space-y-4 m-3"> {/* Increased space-y from 2 to 4 for more space between messages */}
      {messages.map((message, index) => (
        <li
          key={index}
          className={`flex ${message.isSender ? 'justify-end' : 'justify-start'} items-center mx-3 `}
          ref={index === messages.length - 1 ? endRef : null}
        >
          <div className={`flex items-center rounded-xl px-3 font-bold ${message.isSender ? 'bg-green-200 dark:bg-[#33367a] dark:text-slate-200' : 'bg-[#e7e7e7] dark:bg-[#d0d0d0] dark:text-slate-800'}`}>
            <p className="text-xs text-blue-500 px-2"> {/* Added px-2 for padding on the sides of the timestamp */}
              {message.createdAt}
            </p>
            <p className={`flex-grow text-sm px-2 py-2 ${message.isSender ? 'order-2' : 'order-1'}`}> {/* Added px-2 for padding on the sides of the message text */}
              {message.message}
            </p>
            <button 
              onClick={() => handleDeleteMessage(message.id)} 
              title="Delete" 
              className={`order-3 text-red-500 hover:text-red-700 text-[12px]`}> {/* Added px-2 for padding on the sides of the delete button */}
              <FaTrashAlt />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
