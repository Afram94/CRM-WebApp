import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList'; // Your existing MessageList component
import SendMessageForm from './SendMessageForm'; // Your existing SendMessageForm component
import UserList from './UserList'; // Your modified UserList component
import MainLayout from '@/Layouts/MainLayout'; // Your MainLayout component
import { useEcho } from '../../../providers/WebSocketContext'; // Your WebSocket context
import { Message } from '@/types';

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
  const [userId, setUserId] = useState<number | null>(null); // State to hold the current user's ID
  const echo = useEcho();

  const messagesEndRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Depend on messages
  



  useEffect(() => {
    // Fetch current user ID
    const fetchUser = async () => {
      try {
        const response = await axios.get('/current-user');
        setUserId(response.data.id); // Set the current user ID
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();

    const storedToUserId = localStorage.getItem('toUserId');
    if (storedToUserId) {
      setToUserId(storedToUserId);
    }
  }, []); // Empty dependency array means this runs once on component mount

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
            isSender: msg.from_user_id === userId, // Update isSender based on the current user's ID
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Fetching messages failed: ", error);
      }
    };

    fetchMessages();

    /* // Subscribe to Echo channel for real-time messages
    if (echo && userId) {
        const userChannelMessage = echo.private(`chat.${userId}`)
        .listen('.NewChatMessage', (e: { message: Message }) => {
          setMessages((prevMessages) => [...prevMessages, { ...e.message, isSender: e.message.from_user_id === userId }]);
          console.log("here_1");
        });

      return () => {
        
        console.log("here_2");
        userChannelMessage.stopListening('NewChatMessage')
      };
    } */
  }, [toUserId, userId]); // Depend on userId to re-fetch messages when it changes



  useEffect(() => {
    if (echo && userId) {
      const userChannel = echo.private(`chat.${userId}`)
        .listen('.NewChatMessage', (e: { message: Message }) => {
          const incomingMessage = e.message;
          const isSender = incomingMessage.from_user_id === userId;
          setMessages(prevMessages => [...prevMessages, { ...incomingMessage, isSender }]);
        });

        return () => {
            /* echo.leave(`chat.${userId}`); */
            console.log("here_2");
            userChannel.stopListening('NewChatMessage')
          };
    }
  }, [echo, userId]);





  const handleSendMessage = (messageText: string) => {
    if (!toUserId || !userId) {
      console.error("No recipient or sender identified.");
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
    localStorage.setItem('toUserId', userId); // Store the selected user ID in localStorage
  };

  return (
    <MainLayout title="Chat">
      <div className='bg-slate-100 dark:bg-slate-700 py-12 rounded-lg opacity-90' style={{ display: 'flex', height: '600px' }}> {/* 100vh */}
        <div style={{ width: '20%', borderRight: '1px solid #ccc' }}>
        <UserList onSelectUser={handleSelectUser} selectedUserId={toUserId} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
          <MessageList messages={messages} endRef={messagesEndRef} />
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
