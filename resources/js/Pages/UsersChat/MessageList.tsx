import React from 'react';

interface IMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  isSender?: boolean;
}

const MessageList = ({ messages }: { messages: IMessage[] }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {messages.map((message: IMessage, index: number) => (
        <li key={index} style={{ marginBottom: "10px", textAlign: message.isSender ? "right" : "left" }}>
          <div style={{ display: "inline-block", maxWidth: "70%", padding: "5px 10px", borderRadius: "15px", backgroundColor: message.isSender ? "#dcf8c6" : "#fff" }}>
            {message.message}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
