import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import { useEcho } from '../../../providers/WebSocketContext';

interface IMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  isSender?: boolean;
}

const Chat = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const echo = useEcho();

  useEffect(() => {
    axios.get(`/fetch-messages/${userId}`)
      .then((response) => {
        if (Array.isArray(response.data.messages)) {
          const formattedMessages = response.data.messages.map((msg: IMessage) => ({
            ...msg,
            isSender: msg.from_user_id.toString() === userId,
          }));
          setMessages(formattedMessages);
        }
      })
      .catch((error) => console.error("Fetching messages failed: ", error));

    if (echo) {
      echo.private(`chat.${userId}`)
        .listen('NewChatMessage', (e: any) => {
          setMessages((prevMessages) => [...prevMessages, { ...e.message, isSender: e.message.from_user_id.toString() === userId }]);
        });
    }

    return () => {
      if (echo) {
        echo.leave(`chat.${userId}`);
      }
    };
  }, [echo, userId]);

  const handleSendMessage = (messageText: string) => {
    console.log("Sending message to user ID:", userId); // Debug log
    axios.post('/chat/send-message', {
      to_user_id: userId,
      message: messageText
    })
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, { ...response.data.data, isSender: true }]);
      })
      .catch((error) => console.error("Sending message failed: ", error));
  };

  return (
    <div>
      <MessageList messages={messages} />
      <SendMessageForm onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
