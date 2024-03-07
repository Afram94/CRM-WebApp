import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageList from './MessageList'; // Your existing MessageList component
import SendMessageForm from './SendMessageForm'; // Your existing SendMessageForm component
import UserList from './UserList'; // Your modified UserList component
import MainLayout from '@/Layouts/MainLayout'; // Your MainLayout component
import { useEcho } from '../../../providers/WebSocketContext'; // Your WebSocket context

interface IMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  isSender?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [toUserId, setToUserId] = useState<string | null>(null);
  const echo = useEcho();

  useEffect(() => {
    if (!toUserId) {
      console.log('No user selected for chat.');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/fetch-messages/${toUserId}`);
        if (Array.isArray(response.data.messages)) {
          const formattedMessages = response.data.messages.map((msg: IMessage) => ({
            ...msg,
            isSender: msg.from_user_id.toString() === toUserId,
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Fetching messages failed: ", error);
      }
    };

    fetchMessages();

    // Subscribe to Echo channel for real-time messages
    if (echo) {
      echo.private(`chat.${toUserId}`)
        .listen('.NewChatMessage', (e: any) => {
          setMessages((prevMessages) => [...prevMessages, { ...e.message, isSender: e.message.from_user_id.toString() === toUserId }]);
        });

      return () => {
        echo.leave(`chat.${toUserId}`);
      };
    }
  }, [echo, toUserId]); // Depend on toUserId to re-fetch messages when it changes

  const handleSendMessage = (messageText: string) => {
    if (!toUserId) {
      console.error("No recipient selected.");
      return;
    }

    axios.post('/chat/send-message', {
      to_user_id: toUserId,
      message: messageText
    })
    .then(response => {
      setMessages((prevMessages) => [...prevMessages, { ...response.data.data, isSender: true }]);
    })
    .catch(error => {
      console.error("Sending message failed: ", error);
    });
  };

  const handleSelectUser = (userId: string) => {
    setToUserId(userId);
    setMessages([]); // Clear messages when switching users
  };

  return (
    <MainLayout title="Chat">
      <div style={{ display: 'flex', height: '600px' }}> {/* 100vh */}
        <div style={{ width: '20%', borderRight: '1px solid #ccc' }}>
          <UserList onSelectUser={handleSelectUser} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <MessageList messages={messages} />
          </div>
          <div>
            <SendMessageForm onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
